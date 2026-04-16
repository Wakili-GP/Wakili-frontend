import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Award,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Flag,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  Star,
  Trash2,
  Upload,
  User,
  XCircle,
  Camera,
  Phone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { arSA } from "date-fns/locale";
import MainNavbar from "@/components/MainNavbar";
import BlueFooter from "@/components/BlueFooter";
import { useAuth } from "@/stores/auth.store";
import { DEGREE_TYPES } from "@/data/onboarding";

const lawyerData = {
  name: "د. أحمد سليمان",
  title: "شريك أول في مكتب سليمان وشركاه",
  tagline: "متخصص في القضايا التجارية الكبرى والتحكيم الدولي والحوكمة البحرية.",
  specialties: ["القانون التجاري", "التحكيم"],
  profileImage:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop",
  verified: true,
  stats: {
    casesHandled: "1,240+",
    yearsExperience: "18",
    articlesPublished: "45",
    clientRating: "4.9",
  },
  sessionPrice: 450,
  sessionType: "مكتبي / هاتفي",
  about:
    "د. أحمد سليمان محامٍ متميز يمتلك ما يقرب من عقدين من الخبرة في التعامل مع تعقيدات القانون التجاري الدولي. معروف بنهجه الدقيق في استراتيجية القضايا والتزامه الراسخ بالدفاع عن حقوق العملاء، وقد نجح في تمثيل شركات ضمن قائمة Fortune 500 في نزاعات عابرة للحدود رفيعة المستوى. يركز في ممارسته على تقاطع اللوائح البحرية واتفاقيات التجارة العالمية، مقدماً استشارات استراتيجية توازن بين الدقة القانونية والبراغماتية التجارية.",
  workHistory: [
    {
      title: "شريك أول",
      company: "مكتب سليمان وشركاه، دبي",
      period: "2012 — حتى الآن",
      description:
        "قيادة قسم التحكيم الدولي والإشراف على فريق من 45 محامياً عبر ثلاثة مكاتب إقليمية.",
    },
    {
      title: "محامي أول",
      company: "شركاء القانون الدوليون، لندن",
      period: "2008 — 2012",
      description:
        "التخصص في التقاضي البحري ومنازعات العقود ضمن إطار التجارة الأوروبية.",
    },
    {
      title: "محامي مبتدئ",
      company: "هيغنز وشركاه — القانون البحري",
      period: "2005 — 2008",
      description:
        "المساعدة في الإيداعات التنظيمية المعقدة واكتشاف المستندات لشركات الخدمات اللوجستية متعددة الجنسيات.",
    },
  ],
  education: [
    {
      degree: "ماجستير في القانون (LL.M.)",
      field: "حل النزاعات الدولية",
      university: "كينغز كوليج لندن",
      period: "2007 — 2008",
      icon: "🎓",
    },
    {
      degree: "بكالوريوس في القانون (LL.B.)",
      field: "مرتبة الشرف الأولى",
      university: "جامعة القاهرة",
      period: "2001 — 2005",
      icon: "📜",
    },
  ],
  certifications: [
    { name: "محترف تحكيم معتمد", issuer: "رابطة المحامين الدولية (IBA)" },
    { name: "زميل معهد المحكمين المعتمدين", issuer: "CIArb، فرع دبي" },
  ],
  reviews: {
    average: 4.9,
    total: 142,
    breakdown: { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 },
    items: [
      {
        name: "محمد أحمد",
        role: "المدير التنفيذي، شركة اللوجستيات",
        date: "2023-10-24",
        rating: 5,
        comment:
          "قدم د. أحمد سليمان توجيهاً استثنائياً خلال إعادة هيكلة شركتنا. خبرته في قانون التجارة البحرية وفرت علينا أشهراً من التقاضي المحتمل. مستشار سيادي حقيقي.",
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
  recentActivity: [
    {
      time: "منذ يومين",
      title: "نشر مقال: تطور التحكيم البحري في دول الخليج",
      description:
        "نظرة عميقة حول كيف تعيد الإصلاحات القانونية الإقليمية تشكيل نزاعات التجارة الدولية في الشرق الأوسط...",
      icon: "article",
      color: "primary",
    },
    {
      time: "منذ أسبوع",
      title: "متحدث رئيسي في المنتدى القانوني العالمي في دبي",
      description:
        "تقديم عرض حول 'تقاطع الذكاء الاصطناعي والقانون البحري' أمام أكثر من 500 قائد صناعي وخبير قانوني.",
      icon: "event",
      color: "secondary",
    },
    {
      time: "منذ أسبوعين",
      title: "تسوية نزاع تجاري بقيمة 20 مليون دولار بنجاح",
      description:
        "تحقيق تسوية ودية خارج المحكمة لشريك لوجستي إقليمي كبير، مما يضمن استمرارية الأعمال.",
      icon: "success",
      color: "success",
    },
  ],
};

const COUNTRY_CODES = [
  { code: "+20", flag: "🇪🇬", name: "مصر" },
  { code: "+966", flag: "🇸🇦", name: "السعودية" },
  { code: "+971", flag: "🇦🇪", name: "الإمارات" },
  { code: "+965", flag: "🇰🇼", name: "الكويت" },
  { code: "+974", flag: "🇶🇦", name: "قطر" },
  { code: "+973", flag: "🇧🇭", name: "البحرين" },
  { code: "+968", flag: "🇴🇲", name: "عُمان" },
  { code: "+962", flag: "🇯🇴", name: "الأردن" },
  { code: "+961", flag: "🇱🇧", name: "لبنان" },
  { code: "+44", flag: "🇬🇧", name: "المملكة المتحدة" },
  { code: "+1", flag: "🇺🇸", name: "الولايات المتحدة" },
];

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

const REPORT_REASONS = [
  "محتوى مسيء أو تحرش",
  "معلومات كاذبة أو مضللة",
  "تقييم من شخص لم يكن عميلاً",
  "محتوى غير لائق أو مخالف",
  "انتهاك الخصوصية",
  "سبب آخر",
];

const CURRENT_YEAR = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({ length: 60 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);

const LawyerProfile = () => {
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

  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const isOwner = user?.userType === "Lawyer" && user?.id === id;

  const [activeTab, setActiveTab] = useState("bio");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Reviews filters
  const [reviewRatingFilter, setReviewRatingFilter] = useState<number | "all">(
    "all",
  );
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewDateSort, setReviewDateSort] = useState<"newest" | "oldest">(
    "newest",
  );

  // Report review
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState<{
    name: string;
    index: number;
  } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportedReviews, setReportedReviews] = useState<Set<number>>(
    new Set(),
  );

  // Send message
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

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

  const [ownerCalendarDate, setOwnerCalendarDate] = useState<Date | undefined>(
    new Date(),
  );
  const [requestFilter, setRequestFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "rescheduled"
  >("all");

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

  const [newSlot, setNewSlot] = useState({
    from: "09:00",
    to: "11:00",
    type: "office" as "phone" | "office" | "video",
  });

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

  const [ownerSettings, setOwnerSettings] = useState({
    name: lawyerData.name,
    title: lawyerData.title,
    bio: lawyerData.about,
    phoneCode: "+20",
    phoneNumber: "123 456 7890",
    email: user?.email ?? "lawyer@wakili.me",
    country: "مصر",
    city: "القاهرة",
    profileImage: lawyerData.profileImage,
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const weeklyAvailability: Record<number, string[]> = {
    0: ["09:00", "10:00", "11:00", "13:00", "15:00", "16:00"],
    1: ["09:00", "10:00", "12:00", "14:00", "16:00"],
    2: ["09:00", "10:30", "12:30", "14:30", "16:30"],
    3: ["09:00", "11:00", "13:00", "15:00", "16:00"],
    4: ["09:00", "10:00", "12:00", "14:00", "15:30"],
    5: [],
    6: [],
  };

  const availableTimes = selectedDate
    ? (weeklyAvailability[selectedDate.getDay()] ?? [])
    : [];

  const handleBookSession = () => {
    if (!selectedDate) {
      toast.error("يرجى اختيار تاريخ أولاً");
      return;
    }
    if (!selectedTime) {
      toast.error("يرجى اختيار وقت الجلسة");
      return;
    }
    toast.success(
      `تم حجز جلسة بتاريخ ${selectedDate.toLocaleDateString("ar-EG")} الساعة ${selectedTime}`,
    );
  };

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
  const selectedDateSlots = availabilitySlots.filter(
    (s) => s.date === ownerSelectedDateKey,
  );

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

  const handleAddSlot = () => {
    if (!ownerCalendarDate) {
      toast.error("اختر تاريخاً أولاً");
      return;
    }
    if (newSlot.from >= newSlot.to) {
      toast.error("وقت البداية يجب أن يكون قبل وقت النهاية");
      return;
    }
    setAvailabilitySlots((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        date: toDateKey(ownerCalendarDate),
        ...newSlot,
      },
    ]);
    toast.success("تمت إضافة موعد متاح");
  };

  const handleRemoveSlot = (slotId: string) => {
    setAvailabilitySlots((prev) => prev.filter((s) => s.id !== slotId));
    toast.success("تم حذف الموعد");
  };

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

  const handleSendMessage = () => {
    if (!messageSubject.trim()) {
      toast.error("يرجى كتابة موضوع الرسالة");
      return;
    }
    if (!messageBody.trim()) {
      toast.error("يرجى كتابة نص الرسالة");
      return;
    }
    setMessageModalOpen(false);
    setMessageSubject("");
    setMessageBody("");
    toast.success("تم إرسال رسالتك بنجاح");
  };

  const filteredReviews = lawyerData.reviews.items
    .filter((r) => {
      const matchRating =
        reviewRatingFilter === "all" || r.rating === reviewRatingFilter;
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

  const tabs = [
    { id: "bio", label: "السيرة والخبرات" },
    { id: "education", label: "التعليم" },
    { id: "reviews", label: "التقييمات" },
    { id: "activity", label: "آخر النشاطات" },
    ...(isOwner
      ? [
          { id: "calendar", label: "التقويم" },
          { id: "requests", label: "طلبات المواعيد" },
          { id: "availability", label: "المواعيد المتاحة" },
          { id: "settings", label: "إعدادات الملف" },
        ]
      : []),
  ];

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case "article":
        return <FileText className="w-5 h-5 text-primary" />;
      case "event":
        return <MessageCircle className="w-5 h-5 text-secondary" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const slotTypeLabel = (type: string) =>
    type === "phone" ? "هاتفية" : type === "video" ? "فيديو" : "مكتبية";
  const slotTypeBadgeClass = (type: string) =>
    type === "phone"
      ? "bg-blue-500/10 text-blue-700 border-blue-200"
      : type === "video"
        ? "bg-purple-500/10 text-purple-700 border-purple-200"
        : "bg-emerald-500/10 text-emerald-700 border-emerald-200";

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      {/* Hero */}
      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <img
                src={lawyerData.profileImage}
                alt={lawyerData.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
              />
              {lawyerData.verified && (
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center border-2 border-primary">
                  <CheckCircle className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {lawyerData.specialties.map((s, i) => (
                  <Badge
                    key={i}
                    className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {lawyerData.name}
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base mb-2">
                {lawyerData.title}
              </p>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                {lawyerData.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4">
                {[
                  {
                    value: lawyerData.stats.casesHandled,
                    label: "قضية تم التعامل معها",
                  },
                  {
                    value: lawyerData.stats.yearsExperience,
                    label: "سنة خبرة",
                  },
                  {
                    value: lawyerData.stats.articlesPublished,
                    label: "مقال منشور",
                  },
                  {
                    value: `${lawyerData.stats.clientRating} ★`,
                    label: "تقييم العملاء",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center md:text-right">
                    <div className="text-xl md:text-2xl font-bold text-secondary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-primary-foreground/70 tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="border-b border-border mb-8">
              <div className="flex gap-6 flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="tab-underline"
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
              {/* BIO */}
              {activeTab === "bio" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      الملخص المهني
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                      {lawyerData.about}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخبرات العملية
                    </h2>
                    <div className="relative">
                      <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-border" />
                      <div className="space-y-8">
                        {lawyerData.workHistory.map((work, i) => (
                          <div key={i} className="relative pr-8">
                            <div className="absolute right-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                            <div className="text-xs text-secondary font-semibold mb-1">
                              {work.period}
                            </div>
                            <h3 className="font-bold text-foreground">
                              {work.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {work.company}
                            </p>
                            <p className="text-sm text-muted-foreground/80">
                              {work.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {activeTab === "education" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخلفية الأكاديمية
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lawyerData.education.map((edu, i) => (
                        <Card
                          key={i}
                          className="p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="text-3xl mb-4">{edu.icon}</div>
                          <h3 className="font-bold text-lg text-foreground">
                            {edu.degree}
                          </h3>
                          <p className="text-secondary font-semibold text-sm">
                            {edu.field}
                          </p>
                          <div className="mt-4 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {edu.university}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.period}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الشهادات المهنية
                    </h2>
                    <div className="space-y-4">
                      {lawyerData.certifications.map((cert, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 bg-background rounded-lg border"
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-secondary">
                              {cert.issuer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {/* Overall rating */}
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-foreground">
                          {lawyerData.reviews.average}
                        </div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(lawyerData.reviews.average) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {lawyerData.reviews.average}/5 بناءً على{" "}
                          {lawyerData.reviews.total} تقييم
                        </p>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-4 text-muted-foreground">
                              {rating}
                            </span>
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full transition-all"
                                style={{
                                  width: `${lawyerData.reviews.breakdown[rating as keyof typeof lawyerData.reviews.breakdown]}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {
                                lawyerData.reviews.breakdown[
                                  rating as keyof typeof lawyerData.reviews.breakdown
                                ]
                              }
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

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
                          <Card key={i} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={review.image}
                                  alt={review.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <h4 className="font-bold text-foreground">
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
                                {isOwner &&
                                  (isReported ? (
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
                                  ))}
                              </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground italic text-[15px] leading-relaxed">
                              "{review.comment}"
                            </p>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ACTIVITY */}
              {activeTab === "activity" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    آخر التحديثات
                  </h2>
                  <div className="space-y-6">
                    {lawyerData.recentActivity.map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 pb-6 border-b border-border last:border-b-0"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activity.color === "primary" ? "bg-primary/10" : activity.color === "secondary" ? "bg-secondary/10" : "bg-emerald-500/10"}`}
                        >
                          {getActivityIcon(activity.icon)}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-secondary font-semibold tracking-wide mb-1">
                            {activity.time}
                          </p>
                          <h3 className="font-bold text-foreground mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CALENDAR */}
              {isOwner && activeTab === "calendar" && (
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

              {/* REQUESTS */}
              {isOwner && activeTab === "requests" && (
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
                    {filteredRequests.map((request) => (
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
                                    updateRequestStatus(request.id, "approved")
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 ml-1" /> قبول
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 text-red-600"
                                  onClick={() =>
                                    updateRequestStatus(request.id, "rejected")
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
                    ))}
                  </div>
                </div>
              )}

              {/* AVAILABILITY */}
              {isOwner && activeTab === "availability" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-5">
                    <Card className="p-6">
                      <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
                        <Plus className="w-5 h-5 text-secondary" />
                        إضافة موعد متاح
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">
                            من الساعة
                          </label>
                          <Select
                            dir="rtl"
                            value={newSlot.from}
                            onValueChange={(v) =>
                              setNewSlot((p) => ({ ...p, from: v }))
                            }
                          >
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "08:00",
                                "09:00",
                                "10:00",
                                "11:00",
                                "12:00",
                                "13:00",
                                "14:00",
                                "15:00",
                                "16:00",
                              ].map((v) => (
                                <SelectItem
                                  className="cursor-pointer justify-end"
                                  dir="rtl"
                                  key={v}
                                  value={v}
                                >
                                  {v}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">
                            حتى الساعة
                          </label>
                          <Select
                            dir="rtl"
                            value={newSlot.to}
                            onValueChange={(v) =>
                              setNewSlot((p) => ({ ...p, to: v }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "09:00",
                                "10:00",
                                "11:00",
                                "12:00",
                                "13:00",
                                "14:00",
                                "15:00",
                                "16:00",
                                "17:00",
                              ].map((v) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  dir="rtl"
                                  key={v}
                                  value={v}
                                >
                                  {v}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground font-medium">
                            نوع الجلسة
                          </label>
                          <Select
                            dir="rtl"
                            value={newSlot.type}
                            onValueChange={(v: "phone" | "office" | "video") =>
                              setNewSlot((p) => ({ ...p, type: v }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="office">🏢 مكتبية</SelectItem>
                              <SelectItem value="video">🎥 فيديو</SelectItem>
                              <SelectItem value="phone">📞 هاتفية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        onClick={handleAddSlot}
                        className="w-full md:w-auto"
                      >
                        <Plus className="w-4 h-4 ml-2" /> إضافة الموعد
                      </Button>
                    </Card>
                    <Card className="p-6">
                      <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-secondary" />
                        مواعيد اليوم المختار
                        {ownerCalendarDate && (
                          <span className="text-xs text-muted-foreground font-normal mr-2">
                            {formatDateAr(toDateKey(ownerCalendarDate))}
                          </span>
                        )}
                      </h3>
                      {selectedDateSlots.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                          <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            لا توجد مواعيد متاحة لهذا اليوم
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedDateSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="rounded-xl border p-4 flex items-center justify-between hover:shadow-sm transition-shadow bg-background"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${slot.type === "office" ? "bg-emerald-50" : slot.type === "video" ? "bg-purple-50" : "bg-blue-50"}`}
                                >
                                  {slot.type === "office"
                                    ? "🏢"
                                    : slot.type === "video"
                                      ? "🎥"
                                      : "📞"}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">
                                    {slot.from} — {slot.to}
                                  </p>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${slotTypeBadgeClass(slot.type)}`}
                                  >
                                    {slotTypeLabel(slot.type)}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full"
                                onClick={() => handleRemoveSlot(slot.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
                    <div className="mt-4 pt-4 border-t space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        إجمالي المواعيد في هذا اليوم
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {selectedDateSlots.length}
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* SETTINGS */}
              {isOwner && activeTab === "settings" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-secondary" />
                        إعدادات الملف الشخصي
                      </h3>
                      <Button
                        variant={isEditingSettings ? "default" : "outline"}
                        onClick={() => {
                          if (isEditingSettings)
                            toast.success("تم حفظ الإعدادات");
                          setIsEditingSettings((p) => !p);
                        }}
                      >
                        {isEditingSettings ? (
                          <>
                            <Save className="w-4 h-4 ml-1" /> حفظ
                          </>
                        ) : (
                          "تعديل"
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-5 p-4 bg-muted/40 rounded-xl border">
                      <div className="relative">
                        <img
                          src={ownerSettings.profileImage}
                          alt="profile"
                          className="w-20 h-20 rounded-full object-cover border-2 border-border"
                        />
                        <button
                          onClick={() => setIsImageModalOpen(true)}
                          className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {ownerSettings.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {ownerSettings.title}
                        </p>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
                          <Camera className="w-3.5 h-3.5" />
                          تغيير الصورة
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageFileSelect}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-medium">
                          الاسم الكامل
                        </label>
                        <Input
                          disabled={!isEditingSettings}
                          value={ownerSettings.name}
                          onChange={(e) =>
                            setOwnerSettings((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          placeholder="الاسم"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-medium">
                          المسمى الوظيفي
                        </label>
                        <Input
                          disabled={!isEditingSettings}
                          value={ownerSettings.title}
                          onChange={(e) =>
                            setOwnerSettings((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          placeholder="المسمى الوظيفي"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> رقم الهاتف
                      </label>
                      <div className="flex gap-2">
                        <Select
                          disabled={!isEditingSettings}
                          value={ownerSettings.phoneCode}
                          onValueChange={(v) =>
                            setOwnerSettings((p) => ({ ...p, phoneCode: v }))
                          }
                        >
                          <SelectTrigger className="w-36 shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.flag} {c.code} {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          disabled={!isEditingSettings}
                          value={ownerSettings.phoneNumber}
                          onChange={(e) =>
                            setOwnerSettings((p) => ({
                              ...p,
                              phoneNumber: e.target.value,
                            }))
                          }
                          placeholder="رقم الهاتف"
                          className="flex-1"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" /> الدولة
                        </label>
                        <Select
                          disabled={!isEditingSettings}
                          value={ownerSettings.country}
                          onValueChange={(v) =>
                            setOwnerSettings((p) => ({ ...p, country: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            {ARAB_COUNTRIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> المدينة
                        </label>
                        <Input
                          disabled={!isEditingSettings}
                          value={ownerSettings.city}
                          onChange={(e) =>
                            setOwnerSettings((p) => ({
                              ...p,
                              city: e.target.value,
                            }))
                          }
                          placeholder="المدينة"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium">
                        النبذة المهنية
                      </label>
                      <Textarea
                        disabled={!isEditingSettings}
                        value={ownerSettings.bio}
                        onChange={(e) =>
                          setOwnerSettings((p) => ({
                            ...p,
                            bio: e.target.value,
                          }))
                        }
                        rows={5}
                        placeholder="نبذة مهنية..."
                        className="resize-none"
                      />
                      {isEditingSettings && (
                        <p className="text-xs text-muted-foreground text-left">
                          {ownerSettings.bio.length} / 600 حرف
                        </p>
                      )}
                    </div>
                  </Card>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">المؤهلات</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEducationModalOpen(true)}
                        >
                          <Plus className="w-4 h-4 ml-1" /> إضافة
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {educationRecords.map((r) => (
                          <div key={r.id} className="p-2 border rounded-md">
                            <p className="text-sm font-medium">{r.degree}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.university} - {r.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">الشهادات</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsCertificateModalOpen(true)}
                        >
                          <Plus className="w-4 h-4 ml-1" /> إضافة
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {certificateRecords.map((r) => (
                          <div key={r.id} className="p-2 border rounded-md">
                            <p className="text-sm font-medium">{r.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.issuer} - {r.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">الخبرات</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsExperienceModalOpen(true)}
                        >
                          <Plus className="w-4 h-4 ml-1" /> إضافة
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {experienceRecords.map((r) => (
                          <div key={r.id} className="p-2 border rounded-md">
                            <p className="text-sm font-medium">{r.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {r.company} ({r.startYear} - {r.endYear})
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-secondary" /> تغيير كلمة
                        المرور
                      </h4>
                      <div className="space-y-3 mb-3">
                        <Input
                          type="password"
                          placeholder="كلمة المرور الحالية"
                        />
                        <Input
                          type="password"
                          placeholder="كلمة المرور الجديدة"
                        />
                        <Input
                          className="mb-5"
                          type="password"
                          placeholder="تأكيد كلمة المرور"
                        />
                        <Button
                          className="w-full"
                          onClick={() => toast.success("تم تحديث كلمة المرور")}
                        >
                          تحديث كلمة المرور
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking sidebar — shown to non-owners */}
          {!isOwner && (
            <div className="lg:w-[360px] shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <Card className="p-6 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      سعر الجلسة
                    </span>
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      <MapPin className="w-3 h-3 ml-1" />
                      {lawyerData.sessionType}
                    </Badge>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      ${lawyerData.sessionPrice}
                    </span>
                    <span className="text-muted-foreground text-sm">/ساعة</span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-3">
                      المواعيد المتاحة
                    </h4>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      locale={arSA}
                      dir="rtl"
                      className="rounded-lg border w-full"
                    />
                  </div>
                  {selectedDate && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-3">
                        الأوقات المتاحة
                      </h4>
                      {availableTimes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className="h-9 cursor-pointer text-xs"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                          لا توجد مواعيد متاحة في هذا اليوم.
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-3">
                    <Button
                      className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover font-semibold h-12 text-base"
                      onClick={handleBookSession}
                    >
                      <CalendarIcon className="w-5 h-5 ml-2" /> احجز جلسة
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold h-12 text-base"
                      onClick={() => setMessageModalOpen(true)}
                    >
                      <MessageSquare className="w-5 h-5 ml-2" /> أرسل رسالة
                    </Button>
                  </div>
                  <div className="mt-4 text-center space-y-1">
                    <p className="text-xs text-muted-foreground">
                      وقت الاستجابة: عادةً خلال ساعتين
                    </p>
                    <p className="text-xs text-muted-foreground">
                      الإلغاء يتطلب إشعاراً مسبقاً بـ 24 ساعة
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {activeTab === "bio" && (
          <section className="max-w-6xl mx-auto py-12 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Rating Breakdown */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
                  رضا العملاء
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-foreground">
                    {lawyerData.reviews.average}
                  </span>
                  <div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${s <= Math.round(lawyerData.reviews.average) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 uppercase">
                      بناءً على {lawyerData.reviews.total} تقييم
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-4">{rating}</span>
                      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full"
                          style={{
                            width: `${lawyerData.reviews.breakdown[rating as keyof typeof lawyerData.reviews.breakdown]}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {
                          lawyerData.reviews.breakdown[
                            rating as keyof typeof lawyerData.reviews.breakdown
                          ]
                        }
                        %
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Reviews */}
              <div className="space-y-4">
                {lawyerData.reviews.items.slice(0, 2).map((review, i) => (
                  <Card key={i} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-sm">{review.name}</h4>
                          <p className="text-[11px] text-secondary uppercase tracking-wide">
                            {review.role}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── Report Review Modal ── */}
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

      {/* ── Send Message Modal ── */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader className="mt-4">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" />
              إرسال رسالة إلى {lawyerData.name}
            </DialogTitle>
            <DialogDescription>
              سيتلقى المحامي رسالتك ويرد عليها في أقرب وقت ممكن
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                الموضوع <span className="text-red-500">*</span>
              </label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="مثال: استفسار حول قضية تجارية"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                نص الرسالة <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-left">
                {messageBody.length} حرف
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <Button className="flex-1" onClick={handleSendMessage}>
                <Send className="w-4 h-4 ml-1" /> إرسال الرسالة
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMessageModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Image Modal ── */}
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

      {/* ── Education Modal ── */}
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

      {/* ── Certificate Modal ── */}
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

      {/* ── Experience Modal ── */}
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

      <BlueFooter />
    </div>
  );
};

export default LawyerProfile;
