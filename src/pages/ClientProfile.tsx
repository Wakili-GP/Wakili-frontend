import {
  useCallback,
  useEffect,
  useState,
  type InputHTMLAttributes,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  X,
  Edit,
  Heart,
  Phone,
  Building2,
  Settings,
  Briefcase,
  Upload,
  Download,
  Trash2,
  MapPin,
  Search,
  Filter,
  ArrowDownUp,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import MainNavbar from "@/components/MainNavbar";
import BlueFooter from "@/components/BlueFooter";
import { getTimeRemaining } from "@/lib/utils";
import { getAvatarColor, getInitials } from "@/lib/avatarHelpers";
import { mockDocuments, mockActivity } from "@/data/data";
import { COUNTRIES, CITIES_BY_COUNTRY, PHONE_CODES } from "@/data/onboarding";
import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormValues,
  type ChangePasswordFormValues,
} from "@/schemas/client-profile.schema";
import clientProfileService, {
  type ClientProfileInterface,
  type ClientBookingInterface,
} from "@/services/clientProfile-services";
import favoritesService, {
  type FavoriteLawyer,
} from "@/services/favorites-services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ClientProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Active Tabs
  const [activeTab, setActiveTab] = useState("bookings");

  // Bookings Table State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Fetching Bookings
  const { data: bookings } = useQuery({
    queryKey: ["clientBookings"],
    queryFn: () => clientProfileService.getClientBookings(),
  });

  const filteredBookings = (bookings || [])
    .filter((b) => {
      const lawyerName = `${b.lawyerFirstName} ${b.lawyerLastName}`;
      const matchesSearch = lawyerName.includes(search);
      const matchesStatus =
        statusFilter === "الكل" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.sessionDate} ${a.startTime}`).getTime();
      const dateB = new Date(`${b.sessionDate} ${b.startTime}`).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<ClientBookingInterface | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Client Profile Query
  const {
    data: profile,
    isLoading: isClientProfileLoading,
    isError,
  } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: () => clientProfileService.getClientProfile(),
    select: (response): ClientProfileInterface | null => {
      if (response && typeof response === "object" && "data" in response) {
        const wrapped = response as { data?: ClientProfileInterface };
        return wrapped.data ?? null;
      }
      return (response as unknown as ClientProfileInterface) ?? null;
    },
  });

  useEffect(() => {
    if (!isError) return;
    toast.error("خطأ في تحميل بيانات الملف الشخصي", {
      description: "يرجى التحقق من خدمة الإنترنت لديك",
    });
  }, [isError]);

  // Favorits Query
  const {
    data: favoritesResponse,
    isLoading: isFavoritesLoading,
    isError: isFavoritesError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favoritesService.getFavorites(),
  });

  useEffect(() => {
    if (!isFavoritesError) return;
    toast.error("خطأ في تحميل المفضلة");
  }, [isFavoritesError]);

  const displayedFavorites: FavoriteLawyer[] = favoritesResponse?.data ?? [];

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ClientProfileInterface>) =>
      clientProfileService.updateClientProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientProfile"] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => clientProfileService.ChangePassword(currentPassword, newPassword),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (lawyerId: string) => favoritesService.removeFavorite(lawyerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("تم إزالة المحامي من المفضلة بنجاح");
    },
    onError: () => {
      toast.error("تعذر إزالة المحامي من المفضلة");
    },
  });

  // Handlers
  const handleProfileSave = async (data: {
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    phoneNumber: string;
    bio: string;
    profileImage: string;
  }) => {
    const response = await updateProfileMutation.mutateAsync(data);
    if (!response.success) {
      toast.error("تعذر تحديث الملف الشخصي", {
        description: response.error || "حاول مرة أخرى لاحقًا",
      });
      throw new Error(response.error || "Failed to update client profile");
    }
    toast.success("تم تحديث الملف الشخصي بنجاح");
    await queryClient.invalidateQueries({ queryKey: ["clientProfile"] });
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const response = await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
    });
    if (!response.success) {
      toast.error("تعذر تحديث كلمة المرور", {
        description: response.error || "تأكد من صحة كلمة المرور الحالية",
      });
      throw new Error(response.error || "Failed to change password");
    }
    toast.success("تم تحديث كلمة المرور بنجاح");
  };

  // Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مؤكد":
        return (
          <Badge className="bg-success-green/15 text-success-green border-success-green/30 text-xs font-medium">
            <CheckCircle className="w-3 h-3 ml-1" />
            {status}
          </Badge>
        );
      case "مكتمل":
        return (
          <Badge className="bg-primary/15 text-primary border-primary/30 text-xs font-medium">
            {status}
          </Badge>
        );
      case "قيد الانتظار":
        return (
          <Badge className="bg-warning-amber/15 text-warning-amber border-warning-amber/30 text-xs font-medium">
            <Clock className="w-3 h-3 ml-1" />
            {status}
          </Badge>
        );
      case "ملغي":
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs font-medium">
            <X className="w-3 h-3 ml-1" />
            {status}
          </Badge>
        );
      default:
        return <Badge className="text-xs font-medium">{status}</Badge>;
    }
  };

  const TABS = [
    { id: "bookings", label: "حجوزاتي" },
    { id: "favorites", label: "المفضلة" },
    { id: "documents", label: "مستنداتي" },
    { id: "activity", label: "نشاطي" },
  ];

  if (isClientProfileLoading || (!profile && !isError)) {
    return (
      <div className="min-h-screen bg-muted/30" dir="rtl">
        <MainNavbar fixed />
        <div className="pt-36 pb-24 flex items-center justify-center">
          <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
        </div>
        <BlueFooter />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-muted/30" dir="rtl">
        <MainNavbar fixed />
        <div className="pt-36 pb-24 flex items-center justify-center">
          <p className="text-muted-foreground">
            تعذر جلب بيانات الملف الشخصي في الوقت الحالي.
          </p>
        </div>
        <BlueFooter />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const formatMemberSinceLabel = (value?: string | null) => {
    if (!value) return "";
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  };

  const heroStats = [
    {
      icon: MapPin,
      label: "الموقع",
      value:
        `${profile.city ?? ""}${profile.city && profile.country ? "، " : ""}${profile.country ?? ""}` ||
        "غير محدد",
    },
    {
      icon: Calendar,
      label: "عضو منذ",
      value: formatMemberSinceLabel(profile.memberSince),
    },
    {
      icon: Phone,
      label: "رقم الهاتف",
      value: profile.phoneNumber ?? "غير متوفر",
    },
    {
      icon: Briefcase,
      label: "الاستشارات",
      value: `${bookings?.length || 0}`,
    },
    {
      icon: Heart,
      label: "المفضلة",
      value: `${displayedFavorites.length}`,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      {/* Hero */}
      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.firstName}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
                />
              ) : (
                <div
                  className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 shadow-lg flex items-center justify-center text-lg md:text-xl font-bold ${getAvatarColor(
                    `${profile.firstName} ${profile.lastName}`,
                  )}`}
                >
                  {getInitials(profile.firstName, profile.lastName)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  عميل
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                {profile.bio}
              </p>

              {/* Stats bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                {heroStats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 text-primary-foreground/70 text-xs mb-1">
                      <stat.icon className="w-4 h-4" />
                      <span>{stat.label}</span>
                    </div>
                    <p className="text-primary-foreground font-semibold text-sm md:text-base wrap-break-word">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSettingsModalOpen(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <Edit className="w-4 h-4 ml-2" />
                تعديل الملف
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab bar */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-6 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="client-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── Bookings ── */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  حجوزات الاستشارات
                </h2>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary-hover"
                  onClick={() => navigate("/find-lawyers")}
                >
                  احجز استشارة جديدة
                </Button>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "مؤكدة",
                    count:
                      bookings?.filter((b) => b.status === "مؤكد").length || 0,
                    color: "bg-success-green/10 text-success-green",
                  },
                  {
                    label: "مكتملة",
                    count:
                      bookings?.filter((b) => b.status === "مكتمل").length || 0,
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    label: "قيد الانتظار",
                    count:
                      bookings?.filter((b) => b.status === "قيد الانتظار")
                        .length || 0,
                    color: "bg-warning-amber/10 text-warning-amber",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 text-center ${item.color}`}
                  >
                    <div className="text-3xl font-bold">{item.count}</div>
                    <div className="text-xs font-semibold mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="ابحث عن محامي أو تخصص..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pr-10 bg-background w-full"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="w-full sm:w-48 relative">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="cursor-pointer w-full relative pr-3 pl-10 h-10">
                        <SelectValue placeholder="كل الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="الكل">
                          كل الحالات
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="مؤكد">
                          مؤكد
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="مكتمل">
                          مكتمل
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="قيد الانتظار"
                        >
                          قيد الانتظار
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="ملغي">
                          ملغي
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background md:px-6"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                  >
                    <ArrowDownUp className="w-4 h-4" />
                    {sortOrder === "asc" ? "الأقدم أولاً" : "الأحدث أولاً"}
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right pr-20 font-bold">
                        المحامي
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        نوع الاستشارة
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        التخصص
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        التاريخ
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        الوقت
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        الحالة
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        الإجراءات
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.map((booking) => {
                      const lawyerName = `${booking.lawyerFirstName} ${booking.lawyerLastName}`;
                      return (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-2 pr-8">
                              {booking.lawyerProfileImage ? (
                                <img
                                  src={booking.lawyerProfileImage}
                                  alt={lawyerName}
                                  className="w-9 h-9 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(
                                    lawyerName,
                                  )}`}
                                >
                                  {lawyerName
                                    .replace(/^(د\.|أ\.|م\.)\s*/, "")
                                    .charAt(0)}
                                </div>
                              )}
                              <span>{lawyerName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {booking.sessionType === 0 ? "مكتبي" : "هاتفي"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs">
                              غير متوفر
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-center">
                            <div className="font-medium text-foreground">
                              {booking.sessionDate}
                            </div>
                            <div className="text-xs text-secondary mt-1 font-semibold">
                              {getTimeRemaining(
                                booking.sessionDate,
                                booking.startTime,
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-center">
                            {booking.startTime}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsBookingModalOpen(true);
                              }}
                            >
                              التفاصيل
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      السابق
                    </Button>
                    <span className="text-sm">
                      صفحة {currentPage} من {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      التالي
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ── Favorites ── */}
          {activeTab === "favorites" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive" />
                المحامون المفضلون
              </h2>

              {isFavoritesLoading ? (
                <p className="text-muted-foreground text-center py-12">
                  جاري تحميل المفضلة...
                </p>
              ) : displayedFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedFavorites.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/30">
                        <div className="flex p-4 gap-4">
                          {/* Avatar placeholder */}
                          <div className="relative w-16 h-16 shrink-0">
                            <div
                              className={`w-full h-full rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(lawyer.fullName)}`}
                            >
                              {lawyer.fullName.charAt(0)}
                            </div>
                            <button
                              onClick={() =>
                                removeFavoriteMutation.mutate(lawyer.id)
                              }
                              disabled={removeFavoriteMutation.isPending}
                              className="absolute -top-1 -right-1 p-1.5 rounded-full bg-background/90 hover:bg-destructive/10 transition-colors shadow-sm"
                            >
                              <Heart className="w-4 h-4 text-destructive fill-destructive" />
                            </button>
                          </div>

                          <div className="flex-1 space-y-2 min-w-0">
                            <div>
                              <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                                {lawyer.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {lawyer.specializations.slice(0, 2).map((s) => (
                                  <Badge
                                    key={s.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {s.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {lawyer.city}، {lawyer.country}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-3.5 h-3.5" />
                                {lawyer.yearsOfExperience} سنة خبرة
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {lawyer.sessionTypes.map((type) => (
                                <Badge
                                  key={type}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {type === "InOffice" ? (
                                    <Building2 className="w-3 h-3 ml-1" />
                                  ) : (
                                    <Phone className="w-3 h-3 ml-1" />
                                  )}
                                  {type === "InOffice" ? "مكتب" : "هاتف"}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="text-sm font-bold text-primary">
                                {lawyer.phoneSessionPrice > 0 && (
                                  <span>
                                    {lawyer.phoneSessionPrice} ج.م
                                    <span className="text-xs font-normal text-muted-foreground">
                                      /هاتف
                                    </span>
                                  </span>
                                )}
                                {lawyer.inOfficeSessionPrice > 0 && (
                                  <span className="mr-2">
                                    {lawyer.inOfficeSessionPrice} ج.م
                                    <span className="text-xs font-normal text-muted-foreground">
                                      /مكتب
                                    </span>
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                              >
                                عرض الملف
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12">
                  <div className="text-center text-muted-foreground">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      لا يوجد محامون في المفضلة
                    </h3>
                    <p className="text-sm mb-4">
                      ابحث عن محامين وأضفهم إلى قائمة المفضلة للوصول إليهم
                      بسهولة
                    </p>
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary-hover"
                      onClick={() => navigate("/")}
                    >
                      ابحث عن محامي
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* ── Documents ── */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  مستنداتي
                </h2>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  <Upload className="w-4 h-4 ml-2" />
                  رفع مستند جديد
                </Button>
              </div>

              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            {doc.name}
                          </h3>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {doc.uploadDate}
                            </span>
                            <span>{doc.size}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {doc.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="w-3.5 h-3.5 ml-1" />
                          تحميل
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Activity ── */}
          {activeTab === "activity" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">
                نشاطي الأخير
              </h2>
              <div className="space-y-6">
                {mockActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 pb-6 border-b border-border last:border-b-0"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        activity.type === "question"
                          ? "bg-primary/10"
                          : activity.type === "article"
                            ? "bg-secondary/10"
                            : "bg-emerald-500/10"
                      }`}
                    >
                      {activity.type === "question" && (
                        <MessageSquare className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === "article" && (
                        <FileText className="w-5 h-5 text-secondary" />
                      )}
                      {activity.type === "chatbot" && (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-secondary font-semibold tracking-wide">
                          {activity.date}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.type === "question" && "سؤال"}
                          {activity.type === "article" && "مقال"}
                          {activity.type === "chatbot" && "شات بوت"}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground mb-1">
                        {activity.content}
                      </h3>
                      {activity.type === "question" && activity.responses && (
                        <p className="text-sm text-muted-foreground">
                          {activity.responses} رد
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ProfileEditModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        currentData={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          country: profile.country ?? "",
          city: profile.city ?? "",
          phoneNumber: profile.phoneNumber ?? "",
          bio: profile.bio ?? "",
          profileImage: profile.profileImage ?? "",
        }}
        onSave={handleProfileSave}
        isSaving={updateProfileMutation.isPending}
      />
      <AccountSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
        onChangePassword={handleChangePassword}
        isChangingPassword={changePasswordMutation.isPending}
      />

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mt-2">
              تفاصيل الحجز
            </DialogTitle>
          </DialogHeader>

          {selectedBooking &&
            (() => {
              const lawyerName = `${selectedBooking.lawyerFirstName} ${selectedBooking.lawyerLastName}`;
              return (
                <div className="space-y-4 mt-2 mb-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground flex items-center gap-2">
                      محامي الاستشارة
                    </span>
                    <span className="font-semibold flex items-center gap-2">
                      {selectedBooking.lawyerProfileImage ? (
                        <img
                          src={selectedBooking.lawyerProfileImage}
                          alt={lawyerName}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center shrink-0 justify-center text-[10px] font-bold ${getAvatarColor(
                            lawyerName,
                          )}`}
                        >
                          {lawyerName
                            .replace(/^(د\.|أ\.|م\.)\s*/, "")
                            .charAt(0)}
                        </div>
                      )}
                      {lawyerName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">نوع الاستشارة</span>
                    <span className="font-semibold">
                      {selectedBooking.sessionType === 0 ? "مكتبي" : "هاتفي"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">تاريخ الموعد</span>
                    <span className="font-semibold flex items-center gap-2 text-primary">
                      <Calendar className="w-4 h-4" />
                      {selectedBooking.sessionDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">توقيت الموعد</span>
                    <span className="font-semibold flex items-center gap-2 text-primary">
                      <Clock className="w-4 h-4" />
                      {selectedBooking.startTime} - {selectedBooking.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">الحالة</span>
                    <span className="font-semibold">
                      {getStatusBadge(selectedBooking.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-4 bg-muted/20 p-3 rounded-lg">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">
                        تاريخ الإنشاء
                      </span>
                      <span className="font-medium">
                        {new Date(selectedBooking.createdAt).toLocaleDateString(
                          "ar-EG",
                        )}
                      </span>
                    </div>
                    {selectedBooking.confirmedAt && (
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs">
                          تاريخ التأكيد
                        </span>
                        <span className="font-medium">
                          {new Date(
                            selectedBooking.confirmedAt,
                          ).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    )}
                    {selectedBooking.completedAt && (
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs">
                          تاريخ الاكتمال
                        </span>
                        <span className="font-medium">
                          {new Date(
                            selectedBooking.completedAt,
                          ).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    )}
                    {selectedBooking.cancelledAt && (
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs">
                          تاريخ الإلغاء
                        </span>
                        <span className="font-medium">
                          {new Date(
                            selectedBooking.cancelledAt,
                          ).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    )}
                  </div>

                  {(selectedBooking.status === "قيد الانتظار" ||
                    selectedBooking.status === "مؤكد") && (
                    <div className="bg-muted/40 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground">
                          الوقت المتبقي
                        </div>
                        <div className="text-sm font-bold mt-1 text-secondary">
                          {getTimeRemaining(
                            selectedBooking.sessionDate,
                            selectedBooking.startTime,
                          )}
                        </div>
                      </div>
                      <Clock className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              );
            })()}

          <DialogFooter className="sm:justify-start flex gap-2 w-full pt-4 border-t border-border mt-4">
            <Button
              className="flex-1 sm:flex-none"
              variant="outline"
              onClick={() => setIsBookingModalOpen(false)}
            >
              إغلاق
            </Button>
            {selectedBooking &&
              (selectedBooking.status === "قيد الانتظار" ||
                selectedBooking.status === "مؤكد") && (
                <Button
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  onClick={() => {
                    toast.info("إلغاء الحجز لم يتم تفعيله بعد");
                  }}
                >
                  إلغاء الحجز
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BlueFooter />
    </div>
  );
};

interface ProfileData {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  phoneNumber: string;
  bio: string;
  profileImage: string;
}

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: ProfileData;
  onSave: (data: ProfileData) => Promise<void> | void;
  isSaving?: boolean;
}

const ProfileEditModal = ({
  open,
  onOpenChange,
  currentData,
  onSave,
  isSaving = false,
}: ProfileEditModalProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const parsePhone = (fullPhone: string, fallbackCode = "+20") => {
    const normalized = fullPhone.trim();
    const sortedCodes = PHONE_CODES.map((p) => p.code).sort(
      (a, b) => b.length - a.length,
    );
    const matchedCode =
      sortedCodes.find((code) => normalized.startsWith(code)) ?? "";

    // If no code matched, the server stripped it — use fallback
    if (!matchedCode) {
      return { phoneCode: fallbackCode, phoneNumber: normalized };
    }

    const localNumber = normalized.slice(matchedCode.length).trim();
    return { phoneCode: matchedCode, phoneNumber: localNumber };
  };

  const initialPhone = parsePhone(currentData.phoneNumber, "+20");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentData.firstName,
      lastName: currentData.lastName,
      country: currentData.country,
      city: currentData.city,
      phoneCode: initialPhone.phoneCode,
      phoneNumber: initialPhone.phoneNumber,
      bio: currentData.bio,
    },
  });

  const selectedCountry = watch("country");
  const selectedCity = watch("city");

  useEffect(() => {
    if (!open) return;
    const nextPhone = parsePhone(currentData.phoneNumber);
    reset({
      firstName: currentData.firstName,
      lastName: currentData.lastName,
      country: currentData.country,
      city: currentData.city,
      phoneCode: nextPhone.phoneCode,
      phoneNumber: nextPhone.phoneNumber,
      bio: currentData.bio,
    });
    setImageSrc(null);
    setShowCropper(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }, [
    open,
    currentData.firstName,
    currentData.lastName,
    currentData.country,
    currentData.city,
    currentData.phoneNumber,
    currentData.bio,
    reset,
  ]);

  const onCropComplete = useCallback(
    (
      _croppedArea: unknown,
      areaPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(areaPixels);
    },
    [],
  );

  const createCroppedImage = async (): Promise<string | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.height,
          croppedAreaPixels.width,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );
        canvas.toBlob((blob) => {
          resolve(blob ? URL.createObjectURL(blob) : null);
        }, "image/jpeg");
      };
    });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    let finalImage = currentData.profileImage;
    if (showCropper && imageSrc) {
      const croppedImage = await createCroppedImage();
      if (croppedImage) finalImage = croppedImage;
    }
    await onSave({
      firstName: values.firstName,
      lastName: values.lastName,
      country: values.country,
      city: values.city,
      phoneNumber: `${values.phoneCode}${values.phoneNumber}`,
      bio: values.bio ?? "",
      profileImage: finalImage,
    });
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-screen overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="mt-3">تعديل الملف الشخصي</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label>الصورة الشخصية</Label>
          <div className="flex flex-col items-center gap-4">
            {showCropper && imageSrc ? (
              <div className="w-full">
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Label>تكبير / تصغير</Label>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowCropper(false);
                    setImageSrc(null);
                  }}
                  className="cursor-pointer mt-4 w-full"
                >
                  إلغاء الصورة
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {currentData.profileImage ? (
                  <img
                    src={currentData.profileImage}
                    className="w-32 h-32 rounded-full object-cover border-4 border-border"
                    alt="Profile"
                  />
                ) : (
                  <div
                    className={`w-32 h-32 rounded-full border-4 border-border flex items-center justify-center text-lg font-bold ${getAvatarColor(
                      `${currentData.firstName} ${currentData.lastName}`,
                    )}`}
                  >
                    {getInitials(currentData.firstName, currentData.lastName)}
                  </div>
                )}
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>اختر صورة جديدة</span>
                  </div>
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        <form
          id="profile-edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile-first-name">الاسم الأول</Label>
              <Input
                id="profile-first-name"
                placeholder="أدخل الاسم الأول"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-last-name">اسم العائلة</Label>
              <Input
                id="profile-last-name"
                placeholder="أدخل اسم العائلة"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>رقم الهاتف</Label>
            <div className="flex gap-2">
              <Select
                dir="rtl"
                value={watch("phoneCode")}
                onValueChange={(value) =>
                  setValue("phoneCode", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-36 cursor-pointer">
                  <SelectValue placeholder="الكود" />
                </SelectTrigger>
                <SelectContent align="end" className="w-36">
                  {PHONE_CODES.map((item) => (
                    <SelectItem
                      key={item.code}
                      value={item.code}
                      className="justify-end cursor-pointer"
                    >
                      {item.country} {item.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="tel"
                inputMode="numeric"
                placeholder="رقم الهاتف"
                className="flex-1"
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneCode && (
              <p className="text-sm text-destructive">
                {errors.phoneCode.message}
              </p>
            )}
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الدولة</Label>
              <Select
                dir="rtl"
                value={selectedCountry}
                onValueChange={(value) => {
                  setValue("country", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("city", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent align="end">
                  {COUNTRIES.map((country) => (
                    <SelectItem
                      key={country}
                      value={country}
                      className="cursor-pointer justify-end"
                    >
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>المدينة</Label>
              <Select
                dir="rtl"
                value={selectedCity}
                onValueChange={(value) =>
                  setValue("city", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                disabled={!selectedCountry}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent align="end">
                  {(CITIES_BY_COUNTRY[selectedCountry] ?? []).map((city) => (
                    <SelectItem
                      key={city}
                      value={city}
                      className="cursor-pointer justify-end"
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-bio">نبذة مختصرة</Label>
            <Textarea
              id="profile-bio"
              placeholder="أخبرنا عن نفسك"
              rows={4}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>
        </form>

        <DialogFooter className="sm:justify-start mt-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            className="cursor-pointer"
            type="submit"
            form="profile-edit-form"
            disabled={isSaving}
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  isChangingPassword?: boolean;
}

const PasswordInput = ({
  field,
  id,
}: {
  field: InputHTMLAttributes<HTMLInputElement>;
  id: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} {...field} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

const AccountSettingsModal = ({
  open,
  onOpenChange,
  onChangePassword,
  isChangingPassword = false,
}: AccountSettingsModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await onChangePassword(values.currentPassword, values.newPassword);
      reset();
      onOpenChange(false);
    } catch {
      setError("root", {
        message: "حدث خطأ أثناء تحديث كلمة المرور",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="mt-3">
          <DialogTitle className="text-xl text-center font-bold flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            تغيير كلمة المرور
          </DialogTitle>
          <DialogDescription className="text-center">
            قم بتحديث كلمة المرور الخاصة بحسابك
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="old-password">كلمة المرور الحالية</Label>
            <PasswordInput
              field={register("currentPassword")}
              id="old-password"
            />
            {errors.currentPassword && (
              <p className="text-destructive text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <PasswordInput field={register("newPassword")} id="new-password" />
            {errors.newPassword && (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">
              تأكيد كلمة المرور الجديدة
            </Label>
            <PasswordInput
              field={register("confirmPassword")}
              id="confirm-new-password"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-destructive text-sm">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            className="cursor-pointer w-full"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientProfile;
