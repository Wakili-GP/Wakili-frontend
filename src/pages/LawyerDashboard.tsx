import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar as CalendarIcon,
  Clock,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Plus,
  Scale,
  Settings,
  Star,
  TrendingUp,
  Users,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth.store";
import { getInitials, getAvatarColor } from "@/lib/avatarHelpers";
import { useQuery } from "@tanstack/react-query";
import appointmentServices from "@/services/appointment-services";

import AvailibilityTab from "@/components/LawyerDashboard/AvailibilityTab";
import AppointmentsRequestsTab from "@/components/LawyerDashboard/AppointmentsRequestsTab";
import ReviewsTab from "@/components/LawyerDashboard/ReviewsTab";
import ProfileSettingsTab from "@/components/LawyerDashboard/ProfileSettingsTab";
import CalendarTab from "@/components/LawyerDashboard/CalendarTab";
import {
  ownerUpcomingBookings,
  LawyerDashboardReviews,
} from "@/data/data.ts";
import ArticleDashboardPage from "./articles/ArticleDashboardPage";
import ArticleSubmissionPage from "./articles/ArticleSubmissionPage";

const sidebarItems = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "calendar", label: "التقويم", icon: CalendarIcon },
  { id: "requests", label: "طلبات المواعيد", icon: Users },
  { id: "availability", label: "المواعيد المتاحة", icon: Clock },
  { id: "articles", label: "المقالات", icon: FileText },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "settings", label: "إعدادات الملف", icon: Settings },
];

const formatDateAr = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const slotTypeLabel = (type: string) =>
  type === "phone" ? "هاتفية" : type === "video" ? "فيديو" : "مكتبية";

const slotTypeBadgeClass = (type: string) =>
  type === "phone"
    ? "bg-blue-500/10 text-blue-700 border-blue-200"
    : type === "video"
      ? "bg-purple-500/10 text-purple-700 border-purple-200"
      : "bg-emerald-500/10 text-emerald-700 border-emerald-200";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingQueryParams = {
    Page: 1,
    PageSize: 6,
    Status: 0,
    SortDescending: true,
  };

  const { data: pendingRequestsData } = useQuery({
    queryKey: ["receivedAppointments", pendingQueryParams],
    queryFn: () =>
      appointmentServices.getAllReceivedAppointments(pendingQueryParams),
  });

  const pendingCount = pendingRequestsData?.data?.totalCount ?? 0;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch {
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  const activeSectionLabel =
    sidebarItems.find((item) => item.id === activeSection)?.label ?? "";

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      {/* ─── Mobile Overlay ─── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-primary text-primary-foreground flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-foreground/10">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Scale className="w-7 h-7 text-secondary" />
            <span className="text-xl font-bold text-primary-foreground">
              وكيلك
            </span>
          </div>
          <button
            className="lg:hidden text-primary-foreground/70 hover:text-primary-foreground cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lawyer Identity Block */}
        <div className="px-6 py-5 border-b border-primary-foreground/10">
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="w-11 h-11 rounded-full border-2 border-secondary/50 object-cover shrink-0"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-full border-2 border-secondary/50 flex items-center justify-center font-bold text-sm shrink-0 ${getAvatarColor(`${user?.firstName || ""} ${user?.lastName || ""}`)}`}
              >
                {getInitials(user?.firstName || "", user?.lastName || "")}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-primary-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-secondary text-secondary-foreground shadow-md"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
                {item.id === "requests" && pendingCount > 0 && (
                  <span className="mr-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* LogOut Button */}
        <div className="px-3 py-4 border-t border-primary-foreground/10 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/15 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 lg:px-8 shadow-sm">
          <button
            className="lg:hidden ml-3 text-foreground cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            {activeSectionLabel}
          </h1>
          <div className="mr-auto flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate("/")}
                className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                الرئيسية
              </button>
              <button
                onClick={() => navigate(`/lawyer/${user?.id}`)}
                className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                ملفي العام
              </button>
            </nav>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Stats Card Overview */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "إجمالي القضايا",
                        value: "1,240+",
                        icon: FileText,
                        color: "bg-primary/10 text-primary",
                        trend: "+12%",
                      },
                      {
                        label: "سنوات الخبرة",
                        value: 18,
                        icon: BarChart3,
                        color: "bg-secondary/10 text-secondary",
                        trend: null,
                      },
                      {
                        label: "تقييم العملاء",
                        value: "4.9 ★",
                        icon: Star,
                        color: "bg-amber-500/10 text-amber-600",
                        trend: "+0.2",
                      },
                      {
                        label: "مقالات منشورة",
                        value: "15+",
                        icon: MessageCircle,
                        color: "bg-emerald-500/10 text-emerald-600",
                        trend: "+3",
                      },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <Card
                          key={i}
                          className="p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            {stat.trend && (
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />
                                {stat.trend}
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.label}
                          </p>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Two column: upcoming + recent reviews */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold flex items-center gap-2">
                          <Clock className="w-5 h-5 text-secondary" />
                          الحجوزات القادمة
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-secondary cursor-pointer"
                          onClick={() => setActiveSection("calendar")}
                        >
                          عرض الكل
                        </Button>
                      </div>
                      {ownerUpcomingBookings.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed rounded-xl">
                          <CalendarIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            لا توجد حجوزات قادمة
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {ownerUpcomingBookings.slice(0, 4).map((booking) => (
                            <div
                              key={booking.id}
                              className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40 transition-colors"
                            >
                              <img
                                src={booking.clientImage}
                                alt={booking.clientName}
                                className="w-10 h-10 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">
                                  {booking.clientName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDateAr(booking.date)} — {booking.time}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-[10px] shrink-0 ${slotTypeBadgeClass(booking.type)}`}
                              >
                                {slotTypeLabel(booking.type)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>

                    {/* Recent reviews */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-bold flex items-center gap-2">
                          <Star className="w-5 h-5 text-secondary" />
                          آخر التقييمات
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-secondary cursor-pointer"
                          onClick={() => setActiveSection("reviews")}
                        >
                          عرض الكل
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {LawyerDashboardReviews.slice(0, 3).map((review, i) => (
                          <div
                            key={i}
                            className="pb-4 border-b last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <img
                                src={review.image}
                                alt={review.name}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">
                                  {review.name}
                                </p>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3 h-3 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {new Date(review.date).toLocaleDateString(
                                  "ar-EG",
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground italic line-clamp-2 pr-12">
                              "{review.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="text-base font-bold mb-4">إجراءات سريعة</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          label: "إضافة موعد",
                          icon: Plus,
                          section: "availability",
                        },
                        {
                          label: "إدارة الطلبات",
                          icon: Users,
                          section: "requests",
                        },
                        {
                          label: "معاينة الملف",
                          icon: Eye,
                          section: "preview",
                        },
                        {
                          label: "تعديل الإعدادات",
                          icon: Settings,
                          section: "settings",
                        },
                      ].map((action, i) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={i}
                            onClick={() => setActiveSection(action.section)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition-all cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                              {action.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              )}

              {activeSection === "calendar" && <CalendarTab />}
              {activeSection === "requests" && <AppointmentsRequestsTab />}
              {activeSection === "availability" && <AvailibilityTab />}
              {activeSection === "articles" && <ArticleDashboardPage onNavigate={setActiveSection} />}
              {activeSection === "article-submission" && <ArticleSubmissionPage onNavigate={setActiveSection} />}
              {activeSection === "reviews" && (
                <ReviewsTab lawyerId={user?.id ?? ""} reportButton={true} />
              )}
              {activeSection === "settings" && <ProfileSettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default LawyerDashboard;
