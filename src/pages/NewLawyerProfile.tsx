import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Phone,
  Video,
  Building,
  GraduationCap,
  Award,
  Lock,
  User,
  Briefcase,
  Edit2,
  Save,
  Bell,
  FileText,
  MapPin,
  Star,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SiteHeader from "@/components/layout/SiteHeader";

// ── Types ──
interface TimeSlot {
  id: string;
  day: string;
  from: string;
  to: string;
  type: "phone" | "video" | "office";
}

interface AppointmentRequest {
  id: string;
  clientName: string;
  clientImage: string;
  date: string;
  time: string;
  type: "phone" | "video" | "office";
  status: "pending" | "approved" | "rejected" | "rescheduled";
  notes?: string;
}

// ── Mock Data ──
const initialSlots: TimeSlot[] = [
  { id: "1", day: "الأحد", from: "09:00", to: "12:00", type: "office" },
  { id: "2", day: "الأحد", from: "14:00", to: "17:00", type: "video" },
  { id: "3", day: "الاثنين", from: "10:00", to: "13:00", type: "phone" },
  { id: "4", day: "الثلاثاء", from: "09:00", to: "11:00", type: "office" },
  { id: "5", day: "الأربعاء", from: "13:00", to: "16:00", type: "video" },
];

const initialRequests: AppointmentRequest[] = [
  {
    id: "r1",
    clientName: "محمد أحمد",
    clientImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    date: "2025-04-02",
    time: "10:00",
    type: "office",
    status: "pending",
    notes: "استشارة حول قضية تجارية",
  },
  {
    id: "r2",
    clientName: "سارة محمود",
    clientImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    date: "2025-04-03",
    time: "14:00",
    type: "video",
    status: "pending",
    notes: "مراجعة عقد شراكة",
  },
  {
    id: "r3",
    clientName: "أحمد خالد",
    clientImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    date: "2025-03-28",
    time: "11:00",
    type: "phone",
    status: "approved",
  },
  {
    id: "r4",
    clientName: "فاطمة علي",
    clientImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    date: "2025-03-25",
    time: "09:00",
    type: "office",
    status: "rejected",
    notes: "تعارض في المواعيد",
  },
];

const daysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const timeOptions = Array.from({ length: 19 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

// ── Helpers ──
const typeIcon = (t: string) => {
  if (t === "phone") return <Phone className="w-4 h-4" />;
  if (t === "video") return <Video className="w-4 h-4" />;
  return <Building className="w-4 h-4" />;
};
const typeLabel = (t: string) => {
  if (t === "phone") return "هاتفية";
  if (t === "video") return "فيديو";
  return "مكتبية";
};
const statusConfig: Record<string, { label: string; cls: string }> = {
  pending: {
    label: "قيد الانتظار",
    cls: "bg-warning-amber/15 text-warning-amber border-warning-amber/30",
  },
  approved: {
    label: "مقبول",
    cls: "bg-success-green/15 text-success-green border-success-green/30",
  },
  rejected: {
    label: "مرفوض",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
  },
  rescheduled: {
    label: "أُعيد جدولته",
    cls: "bg-primary/15 text-primary border-primary/30",
  },
};

// ── Main Component ──
export default function LawyerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
  const [requests, setRequests] =
    useState<AppointmentRequest[]>(initialRequests);
  const [editingProfile, setEditingProfile] = useState(false);

  const [newSlot, setNewSlot] = useState<{
    day: string;
    from: string;
    to: string;
    type: "phone" | "video" | "office";
  }>({ day: "الأحد", from: "09:00", to: "12:00", type: "office" });

  const [profile, setProfile] = useState({
    name: "د. أحمد سليمان",
    title: "شريك أول في مكتب سليمان وشركاه",
    bio: "محامٍ متميز يمتلك ما يقرب من عقدين من الخبرة في التعامل مع تعقيدات القانون التجاري الدولي.",
    phone: "+20 123 456 7890",
    email: "ahmed@wakilak.com",
    city: "القاهرة",
    price: "450",
  });

  const tabs = [
    { id: "calendar", label: "التقويم" },
    { id: "requests", label: "طلبات المواعيد" },
    { id: "availability", label: "المواعيد المتاحة" },
    { id: "settings", label: "إعدادات الملف" },
  ];

  // ── Handlers ──
  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "approved" as const } : r,
      ),
    );
    toast.success("تم قبول الموعد");
  };
  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rejected" as const } : r,
      ),
    );
    toast.success("تم رفض الموعد");
  };
  const handleReschedule = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "rescheduled" as const } : r,
      ),
    );
    toast.success("تم إعادة جدولة الموعد");
  };

  const addSlot = () => {
    if (newSlot.from >= newSlot.to) {
      toast.error("وقت البداية يجب أن يكون قبل وقت النهاية");
      return;
    }
    setSlots((prev) => [...prev, { ...newSlot, id: Date.now().toString() }]);
    toast.success("تمت إضافة الموعد المتاح");
  };
  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    toast.success("تم حذف الموعد");
  };

  const saveProfile = () => {
    setEditingProfile(false);
    toast.success("تم حفظ التغييرات بنجاح");
  };

  const appointmentDates = requests
    .filter((r) => r.status === "approved" || r.status === "pending")
    .map((r) => new Date(r.date));

  const selectedDateStr = selectedDate?.toISOString().split("T")[0];
  const dayAppointments = requests.filter((r) => r.date === selectedDateStr);
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <SiteHeader showNav={false} />

      {/* Hero - matching LawyerProfile style */}
      <section className="bg-primary pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop"
                alt="Profile"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
              />
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center border-2 border-primary">
                <CheckCircle className="w-4 h-4 text-secondary-foreground" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  لوحة التحكم
                </Badge>
                {pendingCount > 0 && (
                  <Badge className="bg-warning-amber/20 text-warning-amber text-xs font-semibold px-3 py-1 rounded-full border border-warning-amber/30">
                    <Bell className="w-3 h-3 ml-1" />
                    {pendingCount} طلبات جديدة
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                مرحباً، د. أحمد سليمان
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                إدارة المواعيد والاستشارات وإعدادات الملف الشخصي
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4">
                {[
                  {
                    icon: Users,
                    value: `${requests.length}`,
                    label: "إجمالي الطلبات",
                  },
                  {
                    icon: CheckCircle,
                    value: `${requests.filter((r) => r.status === "approved").length}`,
                    label: "مقبولة",
                  },
                  {
                    icon: Clock,
                    value: `${pendingCount}`,
                    label: "قيد الانتظار",
                  },
                  {
                    icon: CalendarIcon,
                    value: `${slots.length}`,
                    label: "مواعيد متاحة",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center md:text-right">
                    <div className="text-xl md:text-2xl font-bold text-secondary flex items-center gap-1.5 justify-center md:justify-start">
                      <stat.icon className="w-4 h-4" />
                      {stat.value}
                    </div>
                    <div className="text-xs text-primary-foreground/70 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate("/lawyer-profile")}
              >
                <Eye className="w-4 h-4 ml-2" />
                عرض الملف الشخصي
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs - underline style matching LawyerProfile */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-all relative flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.id === "requests" && pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="dashboard-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ CALENDAR TAB ═══ */}
          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <CalendarIcon className="w-5 h-5 text-secondary" />
                    التقويم
                  </h2>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg border w-full pointer-events-auto"
                    modifiers={{ booked: appointmentDates }}
                    modifiersClassNames={{
                      booked: "!bg-secondary/20 !text-secondary font-bold",
                    }}
                    classNames={{
                      months:
                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-base font-bold",
                      nav: "space-x-1 flex items-center",
                      nav_button:
                        "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-input hover:bg-muted transition-colors",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse",
                      head_row: "flex justify-around",
                      head_cell:
                        "text-muted-foreground rounded-md w-10 font-semibold text-xs",
                      row: "flex w-full justify-around mt-1",
                      cell: "h-10 w-10 text-center text-sm p-0 relative",
                      day: "h-10 w-10 p-0 font-normal rounded-lg hover:bg-muted transition-colors inline-flex items-center justify-center",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold",
                      day_today: "bg-secondary/20 text-secondary font-bold",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                    }}
                  />
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-foreground mb-4 uppercase tracking-wide text-sm">
                    {selectedDate
                      ? `مواعيد ${selectedDate.toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`
                      : "اختر تاريخاً"}
                  </h3>
                  {dayAppointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">لا توجد مواعيد في هذا اليوم</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-3 rounded-lg border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={apt.clientImage}
                              alt={apt.clientName}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {apt.clientName}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {apt.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              {typeIcon(apt.type)} {typeLabel(apt.type)}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${statusConfig[apt.status].cls}`}
                            >
                              {statusConfig[apt.status].label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          )}

          {/* ═══ REQUESTS TAB ═══ */}
          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                  <Users className="w-5 h-5 text-secondary" />
                  طلبات المواعيد
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "قيد الانتظار",
                      count: requests.filter((r) => r.status === "pending")
                        .length,
                      color: "bg-warning-amber/10 text-warning-amber",
                    },
                    {
                      label: "مقبول",
                      count: requests.filter((r) => r.status === "approved")
                        .length,
                      color: "bg-success-green/10 text-success-green",
                    },
                    {
                      label: "مرفوض",
                      count: requests.filter((r) => r.status === "rejected")
                        .length,
                      color: "bg-destructive/10 text-destructive",
                    },
                    {
                      label: "أُعيد جدولته",
                      count: requests.filter((r) => r.status === "rescheduled")
                        .length,
                      color: "bg-primary/10 text-primary",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-4 text-center ${s.color}`}
                    >
                      <div className="text-3xl font-bold">{s.count}</div>
                      <div className="text-xs font-semibold mt-1">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* List */}
                <div className="space-y-3">
                  {requests.map((req) => (
                    <Card
                      key={req.id}
                      className="p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <img
                            src={req.clientImage}
                            alt={req.clientName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-foreground">
                              {req.clientName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {req.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {req.time}
                              </span>
                              <span className="flex items-center gap-1">
                                {typeIcon(req.type)}
                                {typeLabel(req.type)}
                              </span>
                            </div>
                            {req.notes && (
                              <p className="text-xs text-muted-foreground mt-1.5">
                                {req.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${statusConfig[req.status].cls}`}
                          >
                            {statusConfig[req.status].label}
                          </Badge>
                          {req.status === "pending" && (
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                className="bg-success-green hover:bg-success-green/90 text-primary-foreground h-8 px-3"
                                onClick={() => handleApprove(req.id)}
                              >
                                <CheckCircle className="w-3.5 h-3.5 ml-1" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive/10 h-8 px-3"
                                onClick={() => handleReject(req.id)}
                              >
                                <XCircle className="w-3.5 h-3.5 ml-1" />
                                رفض
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10 h-8 px-3"
                                onClick={() => handleReschedule(req.id)}
                              >
                                <RotateCcw className="w-3.5 h-3.5 ml-1" />
                                إعادة جدولة
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ AVAILABILITY TAB ═══ */}
          {activeTab === "availability" && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Slot */}
                <Card className="p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <Plus className="w-5 h-5 text-secondary" />
                    إضافة موعد متاح
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        اليوم
                      </label>
                      <Select
                        value={newSlot.day}
                        onValueChange={(v) =>
                          setNewSlot((p) => ({ ...p, day: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysAr.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          من
                        </label>
                        <Select
                          value={newSlot.from}
                          onValueChange={(v) =>
                            setNewSlot((p) => ({ ...p, from: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          إلى
                        </label>
                        <Select
                          value={newSlot.to}
                          onValueChange={(v) =>
                            setNewSlot((p) => ({ ...p, to: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        نوع الجلسة
                      </label>
                      <Select
                        value={newSlot.type}
                        onValueChange={(v: "phone" | "video" | "office") =>
                          setNewSlot((p) => ({ ...p, type: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">مكتبية</SelectItem>
                          <SelectItem value="video">فيديو</SelectItem>
                          <SelectItem value="phone">هاتفية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                      onClick={addSlot}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة
                    </Button>
                  </div>
                </Card>

                {/* Current Slots */}
                <Card className="lg:col-span-2 p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <Clock className="w-5 h-5 text-secondary" />
                    المواعيد المتاحة الحالية
                  </h3>
                  {slots.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>لا توجد مواعيد متاحة حالياً</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {daysAr.map((day) => {
                        const daySlots = slots.filter((s) => s.day === day);
                        if (daySlots.length === 0) return null;
                        return (
                          <div key={day}>
                            <h4 className="text-sm font-bold text-foreground mb-2">
                              {day}
                            </h4>
                            <div className="space-y-2">
                              {daySlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className="flex items-center justify-between p-3 rounded-lg border bg-background hover:shadow-sm transition-shadow"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                      {typeIcon(slot.type)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {slot.from} — {slot.to}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {typeLabel(slot.type)}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                    onClick={() => removeSlot(slot.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          )}

          {/* ═══ SETTINGS TAB ═══ */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card className="lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                      <User className="w-5 h-5 text-secondary" />
                      المعلومات الشخصية والمهنية
                    </h2>
                    <Button
                      variant={editingProfile ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        editingProfile ? saveProfile() : setEditingProfile(true)
                      }
                      className={
                        editingProfile
                          ? "bg-success-green hover:bg-success-green/90 text-primary-foreground"
                          : ""
                      }
                    >
                      {editingProfile ? (
                        <>
                          <Save className="w-4 h-4 ml-1" />
                          حفظ
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4 ml-1" />
                          تعديل
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      {
                        label: "الاسم الكامل",
                        key: "name" as const,
                        icon: User,
                      },
                      {
                        label: "المسمى الوظيفي",
                        key: "title" as const,
                        icon: Briefcase,
                      },
                      {
                        label: "البريد الإلكتروني",
                        key: "email" as const,
                        icon: FileText,
                      },
                      {
                        label: "رقم الهاتف",
                        key: "phone" as const,
                        icon: Phone,
                      },
                      { label: "المدينة", key: "city" as const, icon: MapPin },
                      {
                        label: "سعر الجلسة (جنيه)",
                        key: "price" as const,
                        icon: Star,
                      },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                          <field.icon className="w-3.5 h-3.5 text-muted-foreground" />
                          {field.label}
                        </label>
                        <Input
                          value={profile[field.key]}
                          onChange={(e) =>
                            setProfile((p) => ({
                              ...p,
                              [field.key]: e.target.value,
                            }))
                          }
                          disabled={!editingProfile}
                          className="disabled:opacity-70"
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        النبذة المهنية
                      </label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, bio: e.target.value }))
                        }
                        disabled={!editingProfile}
                        rows={4}
                        className="disabled:opacity-70"
                      />
                    </div>
                  </div>
                </Card>

                {/* Side cards */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                      <GraduationCap className="w-5 h-5 text-secondary" />
                      التعليم
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          degree: "ماجستير في القانون",
                          uni: "كينغز كوليج لندن",
                          year: "2008",
                        },
                        {
                          degree: "بكالوريوس في القانون",
                          uni: "جامعة القاهرة",
                          year: "2005",
                        },
                      ].map((edu, i) => (
                        <div key={i} className="p-3 rounded-lg border">
                          <p className="font-semibold text-sm">{edu.degree}</p>
                          <p className="text-xs text-muted-foreground">
                            {edu.uni} — {edu.year}
                          </p>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة مؤهل
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                      <Award className="w-5 h-5 text-secondary" />
                      الشهادات المهنية
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "محترف تحكيم معتمد", issuer: "IBA" },
                        { name: "زميل معهد المحكمين", issuer: "CIArb" },
                      ].map((cert, i) => (
                        <div key={i} className="p-3 rounded-lg border">
                          <p className="font-semibold text-sm">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {cert.issuer}
                          </p>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة شهادة
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                      <Lock className="w-5 h-5 text-secondary" />
                      تغيير كلمة المرور
                    </h3>
                    <div className="space-y-3">
                      <Input
                        type="password"
                        placeholder="كلمة المرور الحالية"
                      />
                      <Input
                        type="password"
                        placeholder="كلمة المرور الجديدة"
                      />
                      <Input
                        type="password"
                        placeholder="تأكيد كلمة المرور الجديدة"
                      />
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                        onClick={() =>
                          toast.success("تم تغيير كلمة المرور بنجاح")
                        }
                      >
                        تحديث كلمة المرور
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-10 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-foreground/50 text-sm">
            &copy; 2024 وكيلك. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
