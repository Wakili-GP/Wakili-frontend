import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Edit,
  Heart,
  MapPin,
  Phone,
  Settings,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MainNavbar from "@/components/MainNavbar";
import { useAuth } from "@/stores/auth.store";
import BlueFooter from "@/components/BlueFooter";
import { getAvatarColor, getInitials } from "@/lib/avatarHelpers";
import { toast } from "sonner";
import clientProfileService, {
  type ClientBookingInterface,
  type ClientProfileInterface,
  type ClientProfileUpdatePayload,
} from "@/services/clientProfile-services";
import BookingsTab from "@/components/client/Profile/BookingsTab";
import FavoritesTab from "@/components/client/Profile/FavoritesTab";
import DocumentsTab from "@/components/client/Profile/DocumentsTab";
import ActivityTab from "@/components/client/Profile/ActivityTab";
import BookingDetailsDialog from "@/components/client/Profile/BookingDetailsDialog";
import ProfileEditModal, {
  type ProfileData,
} from "../components/client/Profile/ProfileEditModal";
import AccountSettingsModal from "@/components/client/Profile/AccountSettingsModal";
import favoritesService from "@/services/favorites-services";

const TABS = [
  { id: "bookings", label: "حجوزاتي" },
  { id: "favorites", label: "المفضلة" },
  { id: "documents", label: "مستنداتي" },
  { id: "activity", label: "نشاطي" },
] as const;

const ClientProfile = () => {
  const queryClient = useQueryClient();
  const { refreshUser, user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("bookings");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<ClientBookingInterface | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: bookings } = useQuery({
    queryKey: ["clientBookings"],
    queryFn: () => clientProfileService.getClientBookings(),
  });

  // Getting Favourites Length
  const {
    data: favoritesResponse,
    isError: isFavoritesError,
  } = useQuery({
    queryKey: ["favorites", userId],
    queryFn: () => favoritesService.getFavorites(),
  });
  useEffect(() => {
    if (!isFavoritesError) return;
    toast.error("خطأ في تحميل المفضلة");
  }, [isFavoritesError]);

  const favoritesLength = favoritesResponse?.length ?? 0;

  const {
    data: profile,
    isLoading: isClientProfileLoading,
    isError,
  } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: () => clientProfileService.getClientProfile(),
    select: (response): ClientProfileInterface | null => response.data ?? null,
  });


  useEffect(() => {
    if (!isError) return;
    toast.error("خطأ في تحميل بيانات الملف الشخصي", {
      description: "يرجى التحقق من خدمة الإنترنت لديك",
    });
  }, [isError]);



  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ClientProfileUpdatePayload>) =>
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



  const handleProfileSave = async (data: ProfileData) => {
    const response = await updateProfileMutation.mutateAsync(data);
    if (!response.success) {
      toast.error("تعذر تحديث الملف الشخصي", {
        description: response.error || "حاول مرة أخرى لاحقًا",
      });
      throw new Error(response.error || "Failed to update client profile");
    }
    toast.success("تم تحديث الملف الشخصي بنجاح");
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["clientProfile"] }),
      refreshUser(),
    ]);
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

  if (isClientProfileLoading || (!profile && !isError)) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background" dir="rtl">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">جاري تحميل الملف الشخصي...</p>
        </div>
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
      value: `${favoritesLength}`,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-border mb-8">
          <div className="flex gap-6 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${activeTab === tab.id
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
          {activeTab === "bookings" && (
            <BookingsTab
              bookings={bookings ?? []}
              onOpenBookingDetails={(booking) => {
                setSelectedBooking(booking);
                setIsBookingModalOpen(true);
              }}
            />
          )}

          {activeTab === "favorites" && (
            <FavoritesTab />
          )}

          {activeTab === "documents" && <DocumentsTab />}

          {activeTab === "activity" && <ActivityTab />}
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
          profileImage: profile.profileImage ?? null,
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

      <BookingDetailsDialog
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        selectedBooking={selectedBooking}
        onCancelBooking={() => {
          toast.info("إلغاء الحجز لم يتم تفعيله بعد");
        }}
      />

      <BlueFooter />
    </div>
  );
};

export default ClientProfile;
