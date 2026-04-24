import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Plus,
  RotateCcw,
  Scale,
  Search,
  Settings,
  Star,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
  Menu,
  X,
  Flag,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { arSA } from "date-fns/locale";
import { useAuth } from "@/stores/auth.store";
import LawyerProfileSettingsTab from "@/components/lawyer/LawyerProfileSettingsTab";
import { DEGREE_TYPES } from "@/data/onboarding";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Camera } from "lucide-react";

import AvailibilityTab from "@/components/LawyerDashboard/AvailibilityTab";

// ─── Types ───────────────────────────────────────────────────────
type AppointmentRequest = {
  id: string;
  clientName: string;
  clientImage: string;
  date: string;
  time: string;
  type: "phone" | "office" | "video";
  status: "pending" | "approved" | "rejected" | "rescheduled";
  notes?: string;
};

type AvailabilitySlot = {
  id: string;
  date: string;
  from: string;
  to: string;
  type: "phone" | "office" | "video";
};

type EducationItem = {
  id: string;
  degree: string;
  field: string;
  university: string;
  year: string;
  documentName?: string;
  documentUrl?: string;
  status: "verified" | "pending";
};

type CertificateItem = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  documentName?: string;
  documentUrl?: string;
  status: "verified" | "pending";
};

type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  startYear: string;
  endYear: string;
  description: string;
  documentName?: string;
  documentUrl?: string;
  status: "verified" | "pending";
};

const ARAB_COUNTRIES = [
  "مصر",
  "السعودية",
  "الإمارات",
  "الكويت",
  "قطر",
  "البحرين",
  "عُمان",
  "الأردن",
  "لبنان",
  "سوريا",
  "العراق",
  "ليبيا",
  "تونس",
  "الجزائر",
  "المغرب",
  "السودان",
  "اليمن",
  "موريتانيا",
];

const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 60 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);

const lawyerData = {
  name: "د. أحمد سليمان",
  title: "شريك أول في مكتب سليمان وشركاه",
  profileImage:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop",
  stats: {
    casesHandled: "1,240+",
    yearsExperience: "18",
    articlesPublished: "45",
    clientRating: "4.9",
  },
  about:
    "د. أحمد سليمان محامٍ متميز يمتلك ما يقرب من عقدين من الخبرة في التعامل مع تعقيدات القانون التجاري الدولي.",
  reviews: {
    average: 4.9,
    total: 142,
    items: [
      {
        name: "محمد أحمد",
        role: "المدير التنفيذي، شركة اللوجستيات",
        date: "2023-10-24",
        rating: 5,
        comment:
          "قدم د. أحمد سليمان توجيهاً استثنائياً خلال إعادة هيكلة شركتنا. خبرته في قانون التجارة البحرية وفرت علينا أشهراً من التقاضي المحتمل.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
      {
        name: "سارة محمود",
        role: "مديرة هيئة الميناء",
        date: "2023-09-12",
        rating: 5,
        comment:
          "دقيق وسريع الاستجابة. جعل الأطر التنظيمية المعقدة سهلة الفهم لمجلس إدارتنا.",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
      {
        name: "خالد العمري",
        role: "رئيس مجلس الإدارة، مجموعة النخبة",
        date: "2023-07-05",
        rating: 4,
        comment:
          "خبرة واسعة ومهنية عالية. أنصح بالتواصل معه للقضايا التجارية الكبرى.",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      },
      {
        name: "نورا السعيد",
        role: "محامية، شركة الفجر للاستشارات",
        date: "2023-05-20",
        rating: 3,
        comment:
          "استجابة جيدة وخبرة مقبولة، لكن كنت أتمنى مزيداً من التفصيل في بعض النقاط.",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      },
    ],
  },
};

// ─── Sidebar Items ───────────────────────────────────────────────
const sidebarItems = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "calendar", label: "التقويم", icon: CalendarIcon },
  { id: "requests", label: "طلبات المواعيد", icon: Users },
  { id: "availability", label: "المواعيد المتاحة", icon: Clock },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "settings", label: "إعدادات الملف", icon: Settings },
  // { id: "preview", label: "معاينة الملف", icon: Eye },
];

// ─── Helper Functions ────────────────────────────────────────────
const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

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

// ─── Component ───────────────────────────────────────────────────
const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calendar
  const [ownerCalendarDate, setOwnerCalendarDate] = useState<Date | undefined>(
    new Date(),
  );

  // Appointments
  const [appointmentRequests, setAppointmentRequests] = useState<
    AppointmentRequest[]
  >([
    {
      id: "r1",
      clientName: "محمد أحمد",
      clientImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      date: "2026-04-14",
      time: "10:00",
      type: "office",
      status: "pending",
      notes: "استشارة بخصوص عقد شراكة",
    },
    {
      id: "r2",
      clientName: "سارة محمود",
      clientImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      date: "2026-04-14",
      time: "12:00",
      type: "video",
      status: "approved",
    },
    {
      id: "r3",
      clientName: "أحمد خالد",
      clientImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      date: "2026-04-15",
      time: "09:30",
      type: "phone",
      status: "pending",
    },
  ]);

  const [requestFilter, setRequestFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "rescheduled"
  >("all");

  // Availability
  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([
    {
      id: "s1",
      date: "2026-04-14",
      from: "09:00",
      to: "11:00",
      type: "office",
    },
    { id: "s2", date: "2026-04-14", from: "14:00", to: "16:00", type: "video" },
    { id: "s3", date: "2026-04-15", from: "10:00", to: "12:00", type: "phone" },
  ]);

  // Settings state
  const [ownerSettings, setOwnerSettings] = useState({
    firstName: user?.firstName ?? "أحمد",
    lastName: user?.lastName ?? "سليمان",
    bio: lawyerData.about,
    summary:
      "محامٍ متميز يمتلك ما يقرب من عقدين من الخبرة في التعامل مع تعقيدات القانون التجاري الدولي.",
    phoneNumber: "+20 123 456 7890",
    email: user?.email ?? "lawyer@wakili.me",
    country: "مصر",
    city: "القاهرة",
    profileImage: lawyerData.profileImage,
    officePrice: "500",
    phonePrice: "300",
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [educationRecords, setEducationRecords] = useState<EducationItem[]>([
    {
      id: "e1",
      degree: "ماجستير في القانون (LL.M.)",
      field: "حل النزاعات الدولية",
      university: "كينغز كوليج لندن",
      year: "2008",
      status: "verified",
    },
  ]);
  const [certificateRecords, setCertificateRecords] = useState<
    CertificateItem[]
  >([
    {
      id: "c1",
      name: "محترف تحكيم معتمد",
      issuer: "رابطة المحامين الدولية (IBA)",
      year: "2012",
      status: "verified",
    },
  ]);
  const [experienceRecords, setExperienceRecords] = useState<ExperienceItem[]>([
    {
      id: "x1",
      title: "شريك أول",
      company: "مكتب سليمان وشركاه",
      startYear: "2012",
      endYear: "حتى الآن",
      description: "قيادة قسم التحكيم الدولي",
      status: "verified",
    },
  ]);

  const [newEducation, setNewEducation] = useState({
    degree: "",
    university: "",
    year: "",
  });
  const [newEducationFile, setNewEducationFile] = useState<File | null>(null);
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    year: "",
  });
  const [newCertificateFile, setNewCertificateFile] = useState<File | null>(
    null,
  );
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startYear: "",
    endYear: "",
    description: "",
  });
  const [newExperienceFile, setNewExperienceFile] = useState<File | null>(null);

  // Reviews state
  const [reportedReviews, setReportedReviews] = useState<Set<number>>(
    new Set(),
  );
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState<{
    name: string;
    index: number;
  } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | "all">(
    "all",
  );
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewDateSort, setReviewDateSort] = useState<"newest" | "oldest">(
    "newest",
  );

  const REPORT_REASONS = [
    "محتوى مسيء أو تحرش",
    "معلومات كاذبة أو مضللة",
    "تقييم من شخص لم يكن عميلاً",
    "محتوى غير لائق أو مخالف",
    "انتهاك الخصوصية",
    "سبب آخر",
  ];

  // ─── Derived ─────────────────────────────────────────────
  const ownerSelectedDateKey = ownerCalendarDate
    ? toDateKey(ownerCalendarDate)
    : "";
  const ownerDayAppointments = appointmentRequests.filter(
    (a) => a.date === ownerSelectedDateKey,
  );
  const ownerUpcomingBookings = [...appointmentRequests]
    .filter((a) => ["pending", "approved", "rescheduled"].includes(a.status))
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    )
    .slice(0, 6);

  const filteredRequests =
    requestFilter === "all"
      ? appointmentRequests
      : appointmentRequests.filter((a) => a.status === requestFilter);

  const requestStatCards = [
    {
      key: "all" as const,
      label: "الكل",
      count: appointmentRequests.length,
      className: "bg-muted text-foreground",
    },
    {
      key: "pending" as const,
      label: "قيد الانتظار",
      count: appointmentRequests.filter((a) => a.status === "pending").length,
      className: "bg-amber-500/10 text-amber-700",
    },
    {
      key: "approved" as const,
      label: "مقبول",
      count: appointmentRequests.filter((a) => a.status === "approved").length,
      className: "bg-emerald-500/10 text-emerald-700",
    },
    {
      key: "rejected" as const,
      label: "مرفوض",
      count: appointmentRequests.filter((a) => a.status === "rejected").length,
      className: "bg-red-500/10 text-red-700",
    },
    {
      key: "rescheduled" as const,
      label: "أُعيد جدولته",
      count: appointmentRequests.filter((a) => a.status === "rescheduled")
        .length,
      className: "bg-blue-500/10 text-blue-700",
    },
  ];

  // ─── Handlers ────────────────────────────────────────────
  const updateRequestStatus = (
    requestId: string,
    status: AppointmentRequest["status"],
  ) => {
    setAppointmentRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r)),
    );
  };

  const handleImageFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setIsImageModalOpen(true);
  };

  const handleImageConfirm = () => {
    if (imagePreview) {
      setOwnerSettings((prev) => ({ ...prev, profileImage: imagePreview }));
      toast.success("تم تحديث الصورة بنجاح");
    }
    setIsImageModalOpen(false);
    setImagePreview(null);
  };

  const handleOpenReport = (name: string, index: number) => {
    setReportingReview({ name, index });
    setReportReason("");
    setReportDetails("");
    setReportModalOpen(true);
  };

  const handleSubmitReport = () => {
    if (!reportReason) {
      toast.error("يرجى اختيار سبب البلاغ");
      return;
    }
    if (reportingReview !== null)
      setReportedReviews((prev) => new Set(prev).add(reportingReview.index));
    setReportModalOpen(false);
    setReportingReview(null);
    toast.success("تم إرسال البلاغ بنجاح. سيتم مراجعته من قِبل الفريق المختص.");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch {
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  // ─── Section label for header ────────────────────────────
  const activeSectionLabel =
    sidebarItems.find((item) => item.id === activeSection)?.label ?? "";

  // ─── Render ──────────────────────────────────────────────
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
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-primary text-primary-foreground flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
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

        {/* Lawyer identity */}
        <div className="px-6 py-5 border-b border-primary-foreground/10">
          <div className="flex items-center gap-3">
            <img
              src={ownerSettings.profileImage}
              alt={`${ownerSettings.firstName} ${ownerSettings.lastName}`}
              className="w-11 h-11 rounded-full border-2 border-secondary/50 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {ownerSettings.firstName} {ownerSettings.lastName}
              </p>
              <p className="text-xs text-primary-foreground/60 truncate">
                {ownerSettings.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
                {item.id === "requests" &&
                  appointmentRequests.filter((a) => a.status === "pending")
                    .length > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {
                        appointmentRequests.filter(
                          (a) => a.status === "pending",
                        ).length
                      }
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
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
            {/* Quick nav links back to main site */}
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
            <div className="h-6 w-px bg-border hidden md:block" />
            <span className="text-sm text-muted-foreground hidden md:block">
              مرحباً، {user?.firstName}
            </span>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.firstName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-sm">
                  {user?.firstName?.charAt(0)}
                </span>
              )}
            </div>
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
              {/* ────────── OVERVIEW ────────── */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "إجمالي القضايا",
                        value: lawyerData.stats.casesHandled,
                        icon: FileText,
                        color: "bg-primary/10 text-primary",
                        trend: "+12%",
                      },
                      {
                        label: "سنوات الخبرة",
                        value: lawyerData.stats.yearsExperience,
                        icon: BarChart3,
                        color: "bg-secondary/10 text-secondary",
                        trend: null,
                      },
                      {
                        label: "تقييم العملاء",
                        value: `${lawyerData.stats.clientRating} ★`,
                        icon: Star,
                        color: "bg-amber-500/10 text-amber-600",
                        trend: "+0.2",
                      },
                      {
                        label: "مقالات منشورة",
                        value: lawyerData.stats.articlesPublished,
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
                        {lawyerData.reviews.items
                          .slice(0, 3)
                          .map((review, i) => (
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

                  {/* Quick actions */}
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

              {/* ────────── CALENDAR ────────── */}
              {activeSection === "calendar" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="p-6">
                      <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-secondary" />
                        حجوزات اليوم المختار
                      </h3>
                      {ownerCalendarDate && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {formatDateAr(toDateKey(ownerCalendarDate))}
                        </p>
                      )}
                      {ownerDayAppointments.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                          <CalendarIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            لا توجد حجوزات في هذا اليوم
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {ownerDayAppointments.map((item) => (
                            <div
                              key={item.id}
                              className="p-4 border rounded-xl flex items-center gap-4 hover:bg-muted/40 transition-colors"
                            >
                              <img
                                src={item.clientImage}
                                alt={item.clientName}
                                className="w-12 h-12 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {item.clientName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.time}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${slotTypeBadgeClass(item.type)}`}
                                >
                                  {slotTypeLabel(item.type)}
                                </Badge>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === "approved" ? "bg-emerald-100 text-emerald-700" : item.status === "pending" ? "bg-amber-100 text-amber-700" : item.status === "rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                                >
                                  {item.status === "approved"
                                    ? "مقبول"
                                    : item.status === "pending"
                                      ? "قيد الانتظار"
                                      : item.status === "rejected"
                                        ? "مرفوض"
                                        : "أُعيد جدولته"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                    <Card className="p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-secondary" />
                        الحجوزات القادمة
                      </h3>
                      {ownerUpcomingBookings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          لا توجد حجوزات قادمة حالياً
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {ownerUpcomingBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="p-4 border rounded-xl flex items-start gap-3 hover:bg-muted/40 transition-colors"
                            >
                              <img
                                src={booking.clientImage}
                                alt={booking.clientName}
                                className="w-11 h-11 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {booking.clientName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDateAr(booking.date)} — {booking.time}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${slotTypeBadgeClass(booking.type)}`}
                              >
                                {slotTypeLabel(booking.type)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                  <Card className="p-6 h-fit">
                    <h3 className="font-bold mb-4">اختر التاريخ</h3>
                    <Calendar
                      mode="single"
                      selected={ownerCalendarDate}
                      onSelect={setOwnerCalendarDate}
                      locale={arSA}
                      dir="rtl"
                      className="rounded-lg border w-full"
                    />
                  </Card>
                </div>
              )}

              {/* ────────── REQUESTS ────────── */}
              {activeSection === "requests" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {requestStatCards.map((card) => (
                      <button
                        key={card.key}
                        type="button"
                        onClick={() => setRequestFilter(card.key)}
                        className={`rounded-xl p-4 text-right border transition-all cursor-pointer ${card.className} ${requestFilter === card.key ? "ring-2 ring-secondary" : "opacity-90 hover:opacity-100"}`}
                      >
                        <p className="text-2xl font-bold">{card.count}</p>
                        <p className="text-xs mt-1">{card.label}</p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {filteredRequests.length === 0 ? (
                      <Card className="p-10 text-center">
                        <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          لا توجد طلبات تطابق الفلتر المختار
                        </p>
                      </Card>
                    ) : (
                      filteredRequests.map((request) => (
                        <Card key={request.id} className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex gap-3 items-start">
                              <img
                                src={request.clientImage}
                                alt={request.clientName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold">
                                  {request.clientName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDateAr(request.date)} - {request.time}
                                </p>
                                {request.notes && (
                                  <p className="text-xs text-muted-foreground mt-1 italic">
                                    {request.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 items-center">
                              <Badge
                                variant="outline"
                                className={`text-xs ${slotTypeBadgeClass(request.type)}`}
                              >
                                {slotTypeLabel(request.type)}
                              </Badge>
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() =>
                                      updateRequestStatus(
                                        request.id,
                                        "approved",
                                      )
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4 ml-1" />{" "}
                                    قبول
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-600 text-red-600"
                                    onClick={() =>
                                      updateRequestStatus(
                                        request.id,
                                        "rejected",
                                      )
                                    }
                                  >
                                    <XCircle className="w-4 h-4 ml-1" /> رفض
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateRequestStatus(
                                        request.id,
                                        "rescheduled",
                                      )
                                    }
                                  >
                                    <RotateCcw className="w-4 h-4 ml-1" /> إعادة
                                  </Button>
                                </>
                              )}
                              {request.status !== "pending" && (
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium ${request.status === "approved" ? "bg-emerald-100 text-emerald-700" : request.status === "rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                                >
                                  {request.status === "approved"
                                    ? "مقبول"
                                    : request.status === "rejected"
                                      ? "مرفوض"
                                      : "أُعيد جدولته"}
                                </span>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ────────── AVAILABILITY ────────── */}
              {activeSection === "availability" && <AvailibilityTab />}

              {/* ────────── REVIEWS ────────── */}
              {activeSection === "reviews" &&
                (() => {
                  const filteredReviews = lawyerData.reviews.items
                    .filter((r) => {
                      const matchRating =
                        reviewRatingFilter === "all" ||
                        r.rating === reviewRatingFilter;
                      const matchSearch =
                        reviewSearch === "" ||
                        r.name.includes(reviewSearch) ||
                        r.role.includes(reviewSearch);
                      return matchRating && matchSearch;
                    })
                    .sort((a, b) => {
                      const da = new Date(a.date).getTime(),
                        db = new Date(b.date).getTime();
                      return reviewDateSort === "newest" ? db - da : da - db;
                    });

                  return (
                    <div className="space-y-6">
                      {/* Stats header */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card className="p-5 text-center">
                          <p className="text-4xl font-bold text-foreground">
                            {lawyerData.reviews.average}
                          </p>
                          <div className="flex justify-center mt-2 gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${s <= Math.round(lawyerData.reviews.average) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            متوسط التقييم
                          </p>
                        </Card>
                        <Card className="p-5 text-center">
                          <p className="text-4xl font-bold text-foreground">
                            {lawyerData.reviews.total}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            إجمالي التقييمات
                          </p>
                        </Card>
                        <Card className="p-5 text-center">
                          <p className="text-4xl font-bold text-emerald-600">
                            92%
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            نسبة الرضا (5 نجوم)
                          </p>
                        </Card>
                      </div>

                      {/* Filter bar */}
                      <div className="flex flex-wrap gap-3 items-center bg-background border rounded-xl px-4 py-3">
                        <div className="flex gap-1 items-center flex-wrap">
                          <span className="text-xs text-muted-foreground ml-1">
                            التقييم:
                          </span>
                          <button
                            onClick={() => setReviewRatingFilter("all")}
                            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-all ${reviewRatingFilter === "all" ? "bg-secondary text-secondary-foreground border-secondary" : "border-border text-muted-foreground hover:border-secondary/50"}`}
                          >
                            الكل
                          </button>
                          {[5, 4, 3, 2, 1].map((r) => (
                            <button
                              key={r}
                              onClick={() => setReviewRatingFilter(r)}
                              className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${reviewRatingFilter === r ? "bg-secondary text-secondary-foreground border-secondary" : "border-border text-muted-foreground hover:border-secondary/50"}`}
                            >
                              {r} <Star className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-40">
                          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                          <input
                            type="text"
                            placeholder="ابحث بالاسم أو الدور..."
                            value={reviewSearch}
                            onChange={(e) => setReviewSearch(e.target.value)}
                            className="text-xs bg-transparent outline-none flex-1 text-right"
                          />
                        </div>
                        <Select
                          dir="rtl"
                          value={reviewDateSort}
                          onValueChange={(v) =>
                            setReviewDateSort(v as "newest" | "oldest")
                          }
                        >
                          <SelectTrigger className="cursor-pointer w-36 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              className="cursor-pointer justify-end"
                              value="newest"
                            >
                              الأحدث أولاً
                            </SelectItem>
                            <SelectItem
                              className="cursor-pointer justify-end"
                              value="oldest"
                            >
                              الأقدم أولاً
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reviews list */}
                      <div className="space-y-4">
                        {filteredReviews.length === 0 ? (
                          <div className="text-center py-10 text-muted-foreground text-sm">
                            لا توجد تقييمات تطابق الفلتر المختار
                          </div>
                        ) : (
                          filteredReviews.map((review, i) => {
                            const isReported = reportedReviews.has(i);
                            return (
                              <Card key={i} className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={review.image}
                                      alt={review.name}
                                      className="w-11 h-11 rounded-full object-cover"
                                    />
                                    <div>
                                      <h4 className="font-bold text-sm">
                                        {review.name}
                                      </h4>
                                      <p className="text-xs text-secondary tracking-wide">
                                        {review.role}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString(
                                        "ar-EG",
                                      )}
                                    </span>
                                    {isReported ? (
                                      <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full font-medium">
                                        <Flag className="w-3 h-3" /> تم الإبلاغ
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleOpenReport(review.name, i)
                                        }
                                        className="cursor-pointer inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 px-2.5 py-1 rounded-full transition-all"
                                      >
                                        <Flag className="w-3 h-3" /> إبلاغ
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-0.5 mb-2">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-4 h-4 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-muted-foreground italic text-sm leading-relaxed">
                                  "{review.comment}"
                                </p>
                              </Card>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* ────────── SETTINGS ────────── */}
              {activeSection === "settings" && (
                <LawyerProfileSettingsTab
                  isEditingSettings={isEditingSettings}
                  setIsEditingSettings={setIsEditingSettings}
                  ownerSettings={ownerSettings}
                  setOwnerSettings={setOwnerSettings}
                  arabCountries={ARAB_COUNTRIES}
                  educationRecords={educationRecords}
                  certificateRecords={certificateRecords}
                  experienceRecords={experienceRecords}
                  setIsEducationModalOpen={setIsEducationModalOpen}
                  setIsCertificateModalOpen={setIsCertificateModalOpen}
                  setIsExperienceModalOpen={setIsExperienceModalOpen}
                  setIsImageModalOpen={setIsImageModalOpen}
                  handleImageFileSelect={handleImageFileSelect}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Report Review Modal ─── */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader className="mt-5 text-center">
            <DialogTitle className="flex justify-center items-center gap-2 text-red-600">
              <Flag className="w-5 h-5" />
              الإبلاغ عن تقييم
            </DialogTitle>
            <DialogDescription className="text-center">
              {reportingReview
                ? `الإبلاغ عن تقييم بقلم "${reportingReview.name}" — سيتم مراجعته من قِبل الفريق المختص`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <label className="text-sm font-medium">
                سبب البلاغ <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportReason(reason)}
                    className={`cursor-pointer w-full text-right px-4 py-3 rounded-lg border text-sm transition-all ${reportReason === reason ? "border-red-400 bg-red-50 text-red-700 font-medium" : "border-border hover:border-muted-foreground/40 hover:bg-muted/40 text-foreground"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${reportReason === reason ? "border-red-500 bg-red-500" : "border-muted-foreground/40"}`}
                      >
                        {reportReason === reason && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      {reason}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm mb-4 font-medium">
                تفاصيل إضافية (اختياري)
              </label>
              <Textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="أضف أي تفاصيل تساعد في مراجعة البلاغ..."
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSubmitReport}
              >
                <Flag className="w-4 h-4 ml-1" /> إرسال البلاغ
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setReportModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Image Modal ─── */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>معاينة الصورة</DialogTitle>
            <DialogDescription>
              تأكد من أن الصورة واضحة وملائمة للملف المهني
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <img
                src={imagePreview ?? ownerSettings.profileImage}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-border shadow-md"
              />
              <p className="text-xs text-muted-foreground">
                {imagePreview ? "هذه هي صورتك الجديدة" : "الصورة الحالية"}
              </p>
            </div>
            <label className="w-full cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageFileSelect}
              />
              <span className="w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted transition-colors">
                <Camera className="w-4 h-4" /> اختر صورة أخرى
              </span>
            </label>
            {imagePreview && (
              <Button className="w-full" onClick={handleImageConfirm}>
                <CheckCircle className="w-4 h-4 ml-1" /> حفظ الصورة
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Education Modal ─── */}
      <Dialog
        open={isEducationModalOpen}
        onOpenChange={setIsEducationModalOpen}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة مؤهل جديد</DialogTitle>
            <DialogDescription className="text-center">
              أضف بيانات مؤهلك العلمي
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select
              dir="rtl"
              value={newEducation.degree}
              onValueChange={(value) =>
                setNewEducation((p) => ({ ...p, degree: value }))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="اختر الدرجة العلمية" />
              </SelectTrigger>
              <SelectContent>
                {DEGREE_TYPES.map((degree) => (
                  <SelectItem
                    key={degree}
                    value={degree}
                    className="justify-end cursor-pointer"
                  >
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="الجامعة"
              value={newEducation.university}
              onChange={(e) =>
                setNewEducation((p) => ({ ...p, university: e.target.value }))
              }
            />
            <Select
              dir="rtl"
              value={newEducation.year}
              onValueChange={(value) =>
                setNewEducation((p) => ({ ...p, year: value }))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="اختر سنة التخرج" />
              </SelectTrigger>
              <SelectContent>
                {GRADUATION_YEARS.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="justify-end cursor-pointer"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setNewEducationFile(file);
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm font-medium">رفع مستند داعم (اختياري)</p>
                <p className="text-xs text-muted-foreground">
                  PDF أو صورة للشهادة
                </p>
                {newEducationFile && (
                  <div className="mt-2 rounded-md bg-muted px-3 py-1 text-xs text-foreground">
                    {newEducationFile.name}
                  </div>
                )}
              </div>
            </label>
            <Button
              className="w-full"
              onClick={() => {
                if (
                  !newEducation.degree ||
                  !newEducation.university ||
                  !newEducation.year
                ) {
                  toast.error("يرجى تعبئة جميع حقول المؤهل");
                  return;
                }
                setEducationRecords((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    degree: newEducation.degree,
                    field: "",
                    university: newEducation.university,
                    year: newEducation.year,
                    documentName: newEducationFile?.name,
                    documentUrl: newEducationFile
                      ? URL.createObjectURL(newEducationFile)
                      : undefined,
                    status: "pending",
                  },
                ]);
                setNewEducation({ degree: "", university: "", year: "" });
                setNewEducationFile(null);
                setIsEducationModalOpen(false);
                toast.success("تمت إضافة المؤهل بنجاح");
              }}
            >
              حفظ المؤهل
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Certificate Modal ─── */}
      <Dialog
        open={isCertificateModalOpen}
        onOpenChange={setIsCertificateModalOpen}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة شهادة جديدة</DialogTitle>
            <DialogDescription className="text-center">
              أضف بيانات الشهادة المهنية
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="اسم الشهادة"
              value={newCertificate.name}
              onChange={(e) =>
                setNewCertificate((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Input
              placeholder="الجهة المانحة"
              value={newCertificate.issuer}
              onChange={(e) =>
                setNewCertificate((p) => ({ ...p, issuer: e.target.value }))
              }
            />
            <Select
              dir="rtl"
              value={newCertificate.year}
              onValueChange={(value) =>
                setNewCertificate((p) => ({ ...p, year: value }))
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="اختر سنة الحصول" />
              </SelectTrigger>
              <SelectContent>
                {GRADUATION_YEARS.map((year) => (
                  <SelectItem
                    key={year}
                    value={year}
                    className="justify-end cursor-pointer"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setNewCertificateFile(file);
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm font-medium">رفع مستند داعم (اختياري)</p>
                <p className="text-xs text-muted-foreground">
                  PDF أو صورة للشهادة
                </p>
                {newCertificateFile && (
                  <div className="mt-2 rounded-md bg-muted px-3 py-1 text-xs text-foreground">
                    {newCertificateFile.name}
                  </div>
                )}
              </div>
            </label>
            <Button
              className="w-full"
              onClick={() => {
                if (
                  !newCertificate.name ||
                  !newCertificate.issuer ||
                  !newCertificate.year
                ) {
                  toast.error("يرجى تعبئة جميع حقول الشهادة");
                  return;
                }
                setCertificateRecords((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    name: newCertificate.name,
                    issuer: newCertificate.issuer,
                    year: newCertificate.year,
                    documentName: newCertificateFile?.name,
                    documentUrl: newCertificateFile
                      ? URL.createObjectURL(newCertificateFile)
                      : undefined,
                    status: "pending",
                  },
                ]);
                setNewCertificate({ name: "", issuer: "", year: "" });
                setNewCertificateFile(null);
                setIsCertificateModalOpen(false);
                toast.success("تمت إضافة الشهادة بنجاح");
              }}
            >
              حفظ الشهادة
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Experience Modal ─── */}
      <Dialog
        open={isExperienceModalOpen}
        onOpenChange={setIsExperienceModalOpen}
      >
        <DialogContent dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle>إضافة خبرة عملية</DialogTitle>
            <DialogDescription className="text-center">
              أضف بيانات خبرة جديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="المسمى الوظيفي"
              value={newExperience.title}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, title: e.target.value }))
              }
            />
            <Input
              placeholder="اسم الجهة"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, company: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                dir="rtl"
                value={newExperience.startYear}
                onValueChange={(value) =>
                  setNewExperience((p) => ({ ...p, startYear: value }))
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="من سنة" />
                </SelectTrigger>
                <SelectContent>
                  {GRADUATION_YEARS.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="justify-end cursor-pointer"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                dir="rtl"
                value={newExperience.endYear}
                onValueChange={(value) =>
                  setNewExperience((p) => ({ ...p, endYear: value }))
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="إلى سنة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="حتى الآن"
                    className="justify-end cursor-pointer"
                  >
                    حتى الآن
                  </SelectItem>
                  {GRADUATION_YEARS.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="justify-end cursor-pointer"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="وصف مختصر"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
            />
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/40">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setNewExperienceFile(file);
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-sm font-medium">رفع مستند داعم (اختياري)</p>
                <p className="text-xs text-muted-foreground">
                  PDF أو صورة لإثبات الخبرة
                </p>
                {newExperienceFile && (
                  <div className="mt-2 rounded-md bg-muted px-3 py-1 text-xs text-foreground">
                    {newExperienceFile.name}
                  </div>
                )}
              </div>
            </label>
            <Button
              className="w-full"
              onClick={() => {
                if (
                  !newExperience.title ||
                  !newExperience.company ||
                  !newExperience.startYear
                ) {
                  toast.error("يرجى تعبئة الحقول الأساسية للخبرة");
                  return;
                }
                setExperienceRecords((p) => [
                  ...p,
                  {
                    id: crypto.randomUUID(),
                    title: newExperience.title,
                    company: newExperience.company,
                    startYear: newExperience.startYear,
                    endYear: newExperience.endYear || "حتى الآن",
                    description: newExperience.description,
                    documentName: newExperienceFile?.name,
                    documentUrl: newExperienceFile
                      ? URL.createObjectURL(newExperienceFile)
                      : undefined,
                    status: "pending",
                  },
                ]);
                setNewExperience({
                  title: "",
                  company: "",
                  startYear: "",
                  endYear: "",
                  description: "",
                });
                setNewExperienceFile(null);
                setIsExperienceModalOpen(false);
                toast.success("تمت إضافة الخبرة بنجاح");
              }}
            >
              حفظ الخبرة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawyerDashboard;
