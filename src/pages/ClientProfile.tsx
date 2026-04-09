// 1. Pending (Client sends until lawyer acepts)
// 2. Accepted/Confirmed (Lawyer accepts the booking)
// 3. Completed ()
import { useState } from "react";
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
  ShieldCheck,
  Heart,
  Star,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProfileEditModal from "@/components/ProfileEditModal";
import AccountSettingsModal from "@/components/AccountSettingsModal";
import { toast } from "sonner";
import MainNavbar from "@/components/MainNavbar";
import BlueFooter from "@/components/BlueFooter";
import { getTimeRemaining } from "@/lib/utils";
import { getAvatarColor } from "@/lib/avatarHelpers";
import {
  mockBookings,
  mockFavoriteLawyers,
  mockDocuments,
  mockActivity,
} from "@/data/data";
interface ClientData {
  name: string;
  location: string;
  bio: string;
  coverImage: string;
  profileImage: string;
  memberSince: string;
  isVerified: boolean;
  email: string;
}

export default function ClientProfile() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const filteredBookings = mockBookings
    .filter((b) => {
      const matchesSearch =
        b.lawyer.includes(search) || b.specialty.includes(search);

      const matchesStatus =
        statusFilter === "الكل" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const [clientData, setClientData] = useState<ClientData>({
    name: "محمد أحمد",
    location: "القاهرة، مصر",
    bio: "مهتم بالاستشارات القانونية للشركات الناشئة",
    coverImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=300&fit=crop",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    memberSince: "2023",
    isVerified: false,
    email: "mohamed@example.com",
  });

  const [activeTab, setActiveTab] = useState("bookings");
  const [favoriteLawyers, setFavoriteLawyers] = useState<number[]>(() => {
    const saved = localStorage.getItem("favoriteLawyers");
    const parsed = saved ? JSON.parse(saved) : [];
    if (parsed.length === 0) {
      const defaultIds = mockFavoriteLawyers.map((l) => l.id);
      localStorage.setItem("favoriteLawyers", JSON.stringify(defaultIds));
      return defaultIds;
    }
    return parsed;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const removeFavorite = (lawyerId: number) => {
    const newFavorites = favoriteLawyers.filter((id) => id !== lawyerId);
    setFavoriteLawyers(newFavorites);
    localStorage.setItem("favoriteLawyers", JSON.stringify(newFavorites));
    toast.success("تم إزالة المحامي من المفضلة");
  };

  const displayedFavorites = mockFavoriteLawyers.filter((l) =>
    favoriteLawyers.includes(l.id),
  );

  const handleProfileSave = (data: {
    name: string;
    location: string;
    bio: string;
    profileImage: string;
  }) => {
    setClientData((prev) => ({ ...prev, ...data }));
  };

  const handleVerifyClick = () => {
    toast.info("سيتم التواصل معك قريباً للتحقق من هويتك");
  };

  const tabs = [
    { id: "bookings", label: "حجوزاتي" },
    { id: "favorites", label: "المفضلة" },
    { id: "documents", label: "مستنداتي" },
    { id: "activity", label: "نشاطي" },
  ];

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

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      {/* ── Hero — mirrors LawyerProfile hero structure exactly ── */}
      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={clientData.profileImage}
                alt={clientData.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Badge row — mirrors specialty badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  عميل
                </Badge>
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {clientData.name}
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                {clientData.bio}
              </p>

              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-6 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4">
                {[
                  { icon: MapPin, value: clientData.location, label: "الموقع" },
                  {
                    icon: Calendar,
                    value: `منذ ${clientData.memberSince}`,
                  },
                  {
                    icon: Briefcase,
                    value: `${mockBookings.length} استشارات`,
                  },
                  {
                    icon: Heart,
                    value: `${displayedFavorites.length} مفضل`,
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-base md:text-[13px] font-bold text-secondary flex items-center gap-1.5 justify-center md:justify-start"
                  >
                    <stat.icon className="w-5 h-5" />
                    {stat.value}
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

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab bar — identical to LawyerProfile */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-6 flex-wrap">
            {tabs.map((tab) => (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "مؤكدة",
                    count: mockBookings.filter((b) => b.status === "مؤكد")
                      .length,
                    color: "bg-success-green/10 text-success-green",
                  },
                  {
                    label: "مكتملة",
                    count: mockBookings.filter((b) => b.status === "مكتمل")
                      .length,
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    label: "قيد الانتظار",
                    count: mockBookings.filter(
                      (b) => b.status === "قيد الانتظار",
                    ).length,
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
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm mb-6">
                {/* Search */}
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
                  {/* Status Filter */}
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

                  {/* Sort */}
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
                    {paginatedBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2 pr-8">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(
                                booking.lawyer,
                              )}`}
                            >
                              {booking.lawyer
                                .replace(/^(د\.|أ\.|م\.)\s*/, "") // Remove titles
                                .charAt(0)}
                            </div>
                            <span>{booking.lawyer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{booking.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {booking.specialty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-center">
                          <div className="font-medium text-foreground">
                            {booking.date}
                          </div>
                          <div className="text-xs text-secondary mt-1 font-semibold">
                            {getTimeRemaining(booking.date, booking.time)}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.time}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-center items-center gap-2 mt-4">
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

              {displayedFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedFavorites.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/30">
                        <div className="flex">
                          <div className="relative w-32 h-40 shrink-0">
                            <img
                              src={lawyer.image}
                              alt={lawyer.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeFavorite(lawyer.id)}
                              className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-destructive/10 transition-colors"
                            >
                              <Heart className="w-5 h-5 text-destructive fill-destructive" />
                            </button>
                          </div>
                          <div className="flex-1 p-4 space-y-3">
                            <div>
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {lawyer.name}
                              </h3>
                              <Badge variant="secondary" className="mt-1">
                                {lawyer.specialty}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {lawyer.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-secondary fill-secondary" />
                                <span className="font-semibold text-foreground">
                                  {lawyer.rating}
                                </span>
                                <span>({lawyer.reviewCount})</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {lawyer.sessionTypes.map((type) => (
                                <Badge
                                  key={type}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {type === "مكتب" ? (
                                    <Building2 className="w-3 h-3 ml-1" />
                                  ) : (
                                    <Phone className="w-3 h-3 ml-1" />
                                  )}
                                  {type}
                                </Badge>
                              ))}
                              <span className="text-sm text-muted-foreground">
                                • {lawyer.yearsExperience} سنة خبرة
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="text-lg font-bold text-primary">
                                {lawyer.price} ج.م
                                <span className="text-sm font-normal text-muted-foreground">
                                  /جلسة
                                </span>
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

          {/* ── Activity — matches LawyerProfile "activity" tab layout exactly ── */}
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
                    {/* Icon circle — mirrors LawyerProfile recentActivity icon circles */}
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
                      {/* Date label — mirrors activity.time style: text-xs text-secondary font-semibold */}
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
                      {/* Content as bold title — mirrors activity.title */}
                      <h3 className="font-bold text-foreground mb-1">
                        {activity.content}
                      </h3>
                      {/* Description — mirrors activity.description */}
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
        currentData={clientData}
        onSave={handleProfileSave}
      />
      <AccountSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
      />

      <BlueFooter />
    </div>
  );
}
