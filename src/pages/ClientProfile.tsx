import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AccountSettingsModals from "@/components/AccountSettingsModal";
import CoverImageEditModal from "@/components/CoverImageEditModal";
import ProfileEditModal from "@/components/ProfileEditModal";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  X,
  Edit,
  Heart,
  Star,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import {
  clientProfileService,
  type ClientProfile as ClientProfileType,
  type FavoriteLawyer,
  type Booking,
} from "@/services/clientProfile-services";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [clientData, setClientData] = useState<ClientProfileType | null>(null);
  const [favoriteLawyers, setFavoriteLawyers] = useState<FavoriteLawyer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    const response = await clientProfileService.getProfile();
    if (response.success && response.data) {
      setClientData(response.data);
    }
    setIsLoading(false);
  };

  // Fetch favorite lawyers
  useEffect(() => {
    const fetchFavorites = async () => {
      setFavoritesLoading(true);
      const response = await clientProfileService.getFavoriteLawyers();
      if (response.success && response.data) {
        setFavoriteLawyers(response.data);
      }
      setFavoritesLoading(false);
    };
    fetchFavorites();
  }, []);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      const response = await clientProfileService.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      }
      setBookingsLoading(false);
    };
    fetchBookings();
  }, []);

  const handleProfileSave = async (data: {
    name: string;
    location: string;
    bio: string;
    profileImage: string;
  }) => {
    const [firstName, ...lastNameParts] = data.name.split(" ");
    const lastName = lastNameParts.join(" ");

    const response = await clientProfileService.updateProfile({
      firstName,
      lastName,
      bio: data.bio,
    });

    if (response.success && response.data) {
      setClientData(response.data);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } else {
      toast.error("فشل تحديث الملف الشخصي");
    }
  };

  const handleCoverSave = async (input: string | File) => {
    let file: File;

    if (typeof input === "string") {
      // If string URL is provided, skip upload (for compatibility)
      if (clientData) {
        setClientData({ ...clientData, coverImage: input });
      }
      toast.success("تم تحديث صورة الغلاف بنجاح");
      return;
    }

    file = input;
    const response = await clientProfileService.uploadCoverImage(file);
    if (response.success && response.data) {
      if (clientData) {
        setClientData({ ...clientData, coverImage: response.data.imageUrl });
      }
      toast.success("تم تحديث صورة الغلاف بنجاح");
    } else {
      toast.error("فشل تحديث صورة الغلاف");
    }
  };

  const handleNewConsultation = () => {
    navigate("/home", { state: { activeSection: "محامي" } });
  };

  const handleRemoveFavorite = async (lawyerId: string) => {
    const response = await clientProfileService.removeFavoriteLawyer(lawyerId);
    if (response.success) {
      setFavoriteLawyers((prev) => prev.filter((l) => l.id !== lawyerId));
      toast.success("تم إزالة المحامي من المفضلة");
    } else {
      toast.error("فشلت إزالة المحامي");
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "مؤكد":
        return (
          <Badge className="bg-success-light text-success-dark">
            <CheckCircle className="w-3 h-3 ml-1" />
            مؤكد
          </Badge>
        );
      case "completed":
      case "مكتمل":
        return <Badge variant="secondary">مكتمل</Badge>;
      case "pending":
      case "قيد الانتظار":
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 ml-1" />
            قيد الانتظار
          </Badge>
        );
      case "cancelled":
      case "ملغي":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 ml-1" />
            ملغي
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading || !clientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="relative">
        <div className="h-64 overflow-hidden relative group">
          <img
            src={
              clientData.coverImage ||
              "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=300&fit=crop"
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <Button
            className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            variant="secondary"
            size="sm"
            onClick={() => setIsCoverModalOpen(true)}
          >
            <Edit className="w-4 h-4 ml-2" /> تعديل الغلاف
          </Button>
        </div>
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <img
                  src={
                    clientData.profileImage ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                  }
                  alt={`${clientData.firstName} ${clientData.lastName}`}
                  className="w-36 h-36 rounded-full border-4 border-background shadow-lg object-cover"
                />
              </div>
              <div className="flex-1 bg-card p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="mb-2">
                      <h1 className="text-2xl font-bold">{`${clientData.firstName} ${clientData.lastName}`}</h1>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {clientData.bio || "لا يوجد نبذة تعريفية"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {clientData.city && clientData.country && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{`${clientData.city}، ${clientData.country}`}</span>
                        </div>
                      )}
                      <div>
                        عضو منذ {new Date(clientData.joinedDate).getFullYear()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="cursor-pointer h-10 w-10"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      className="cursor-pointer"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل الملف الشخصي
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="w-full flex-row-reverse justify-start mb-6">
            <TabsTrigger value="bookings" className="cursor-pointer">
              حجوزاتي
            </TabsTrigger>
            <TabsTrigger value="favorites" className="cursor-pointer">
              المفضلة
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <Card dir="rtl" className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>حجوزات الاستشارات</span>
              </h2>
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-muted animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div dir="rtl" className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المحامي</TableHead>
                        <TableHead>نوع الاستشارة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الوقت</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {booking.lawyerImage && (
                                <img
                                  src={booking.lawyerImage}
                                  alt={booking.lawyerName}
                                  className="w-8 h-8 rounded-full"
                                />
                              )}
                              {booking.lawyerName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.consultationType === "video" && "فيديو"}
                            {booking.consultationType === "phone" && "هاتف"}
                            {booking.consultationType === "in-person" && "مكتب"}
                          </TableCell>
                          <TableCell>
                            {new Date(booking.date).toLocaleDateString("ar-EG")}
                          </TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>{booking.price} ج.م</TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <Button
                              className="cursor-pointer"
                              variant="outline"
                              size="sm"
                            >
                              التفاصيل
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد حجوزات</h3>
                  <p className="text-muted-foreground mb-4">
                    ابدأ بحجز استشارة قانونية مع أحد محامينا المتخصصين
                  </p>
                </div>
              )}
              <div className="mt-6">
                <Button
                  onClick={handleNewConsultation}
                  className="cursor-pointer"
                >
                  احجز استشارة جديدة
                </Button>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="favorites">
            <Card dir="rtl" className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span>المحامون المفضلون</span>
              </h2>
              {favoritesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-muted animate-pulse rounded-lg"
                    ></div>
                  ))}
                </div>
              ) : favoriteLawyers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteLawyers.map((fav) => (
                    <FavLawyer
                      key={fav.id}
                      fav={fav}
                      onRemove={handleRemoveFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    لا يوجد محامون في المفضلة
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    ابحث عن محامين وأضفهم إلى قائمة المفضلة للوصول إليهم بسهولة
                  </p>
                  <Button
                    onClick={handleNewConsultation}
                    className="cursor-pointer"
                  >
                    ابحث عن محامي
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        <AccountSettingsModals
          open={isSettingsModalOpen}
          onOpenChange={setIsSettingsModalOpen}
        />
        <ProfileEditModal
          open={isProfileModalOpen}
          onOpenChange={setIsProfileModalOpen}
          currentData={{
            name: `${clientData.firstName} ${clientData.lastName}`,
            location:
              clientData.city && clientData.country
                ? `${clientData.city}، ${clientData.country}`
                : "",
            bio: clientData.bio || "",
            profileImage: clientData.profileImage || "",
          }}
          onSave={handleProfileSave}
        />
        <CoverImageEditModal
          open={isCoverModalOpen}
          onOpenChange={setIsCoverModalOpen}
          currentCover={clientData.coverImage || ""}
          onSave={handleCoverSave}
        />
      </div>
      <Footer />
    </div>
  );
};
interface FavLawyerProps {
  fav: FavoriteLawyer;
  onRemove: (lawyerId: string) => void;
}

const FavLawyer = ({ fav, onRemove }: FavLawyerProps) => {
  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="relative w-48 shrink-0">
          <img
            src={
              fav.profileImage ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            alt={`${fav.firstName} ${fav.lastName}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-4 space-y-2">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold">{`${fav.firstName} ${fav.lastName}`}</h3>
              <Badge variant="secondary">{fav.specialties[0]}</Badge>
            </div>
            <button onClick={() => onRemove(fav.id)} className="cursor-pointer">
              <Heart className="w-6 h-6 text-red-500 fill-red-500 hover:opacity-70 transition-opacity" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{fav.rating}</span>
            <span>({fav.reviewCount} تقييم)</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {fav.isVerified && (
              <Badge
                variant="outline"
                className="bg-success-light text-success-dark"
              >
                <CheckCircle className="w-3 h-3 ml-1" />
                موثق
              </Badge>
            )}
            <span className="text-muted-foreground">
              {fav.yearsOfExperience} سنة خبرة
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-primary">
              {fav.hourlyRate} ج.م / جلسة
            </span>
            <Button size="sm" className="cursor-pointer">
              عرض الملف
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ClientProfile;
