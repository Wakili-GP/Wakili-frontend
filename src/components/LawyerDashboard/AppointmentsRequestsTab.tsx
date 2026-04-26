import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  XCircle,
  Users,
  Search,
  Loader2,
  Phone,
  Building,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import appointmentServices, {
  type AppointmentInterface,
} from "@/services/appointment-services";
import {
  type SearchFormValues,
  searchSchema,
} from "@/schemas/appointment-slots.schema";

// Constants
const PAGE_SIZE = 6;

type StatusFilter = "all" | 0 | 1 | 2 | 3;

const STATUS_MAP: Record<number, { label: string; class: string }> = {
  0: { label: "قيد الانتظار", class: "bg-amber-100 text-amber-700" },
  1: { label: "مُؤكد", class: "bg-emerald-100 text-emerald-700" },
  2: { label: "ملغي", class: "bg-red-100 text-red-700" },
  3: { label: "مكتمل", class: "bg-blue-100 text-blue-700" },
};

const SESSION_TYPE_MAP: Record<number, { label: string; badgeClass: string }> =
  {
    0: {
      label: "هاتفية",
      badgeClass: "bg-blue-500/10 text-blue-700 border-blue-200",
    },
    1: {
      label: "مكتبية",
      badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    },
  };

const formatDateAr = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTime = (time: string) => time.slice(0, 5);

const SessionTypeIcon = ({ type }: { type: number }) =>
  type === 0 ? (
    <Phone className="w-4 h-4 text-blue-500" />
  ) : (
    <Building className="w-4 h-4 text-amber-600" />
  );

// Stat Card Sub-component
interface StatCardProps {
  label: string;
  count: number;
  className: string;
  isActive: boolean;
  onClick: () => void;
}

const StatCard = ({
  label,
  count,
  className,
  isActive,
  onClick,
}: StatCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-xl p-4 text-right border transition-all cursor-pointer ${className} ${
      isActive ? "ring-2 ring-secondary" : "opacity-90 hover:opacity-100"
    }`}
  >
    <p className="text-2xl font-bold">{count}</p>
    <p className="text-xs mt-1">{label}</p>
  </button>
);

// Appointment Card Sub-component
interface AppointmentCardProps {
  appointment: AppointmentInterface;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
  isConfirming: boolean;
  isRejecting: boolean;
}

const AppointmentCard = ({
  appointment,
  onConfirm,
  onReject,
  isConfirming,
  isRejecting,
}: AppointmentCardProps) => {
  const status = STATUS_MAP[appointment.status];
  const sessionType = SESSION_TYPE_MAP[appointment.sessionType] ?? {
    label: "غير محدد",
    badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const fullName = `${appointment.clientFirstName} ${appointment.clientLastName}`;

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      {/* Top row: client info + status */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Client info */}
        <div className="flex gap-3 items-start">
          {appointment.clientProfileImage ? (
            <img
              src={appointment.clientProfileImage}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-muted"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="space-y-1">
            <p className="font-semibold text-base">{fullName}</p>
            {appointment.clientPhone && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {appointment.clientPhone}
              </p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap self-start ${status?.class ?? "bg-gray-100 text-gray-600"}`}
        >
          {status?.label ?? "غير معروف"}
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 bg-muted/30 rounded-lg p-3">
        {/* Session date */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-medium">
            تاريخ الجلسة
          </p>
          <p className="text-xs font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary" />
            {formatDateAr(appointment.sessionDate)}
          </p>
        </div>

        {/* Time range */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-medium">الوقت</p>
          <p className="text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            {formatTime(appointment.startTime)} –{" "}
            {formatTime(appointment.endTime)}
          </p>
        </div>

        {/* Session type */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-medium">
            نوع الجلسة
          </p>
          <Badge
            variant="outline"
            className={`text-[10px] ${sessionType.badgeClass}`}
          >
            <SessionTypeIcon type={appointment.sessionType} />
            <span className="mr-1">{sessionType.label}</span>
          </Badge>
        </div>

        {/* Created at */}
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-medium">
            تاريخ الطلب
          </p>
          <p className="text-xs font-semibold">
            {formatDateAr(appointment.createdAt)}
          </p>
        </div>
      </div>

      {/* Action buttons (only for pending) */}
      {appointment.status === 0 && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isConfirming}
            onClick={() => onConfirm(appointment.id)}
          >
            {isConfirming ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 ml-1" />
            )}
            تأكيد
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            disabled={isRejecting}
            onClick={() => onReject(appointment.id)}
          >
            {isRejecting ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 ml-1" />
            )}
            رفض
          </Button>
        </div>
      )}
    </Card>
  );
};

// Main Component
const AppointmentsRequestsTab = () => {
  const queryClient = useQueryClient();

  // Local UI state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  // React Hook Form for search
  const { register, handleSubmit } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchTerm: "" },
  });

  const onSearch = (values: SearchFormValues) => {
    setActiveSearchTerm(values.searchTerm ?? "");
    setCurrentPage(1);
  };

  // Build query params
  const queryParams = {
    Page: currentPage,
    PageSize: PAGE_SIZE,
    ...(activeSearchTerm ? { SearchTerm: activeSearchTerm } : {}),
    ...(statusFilter !== "all" ? { Status: statusFilter } : {}),
    SortDescending: sortDescending,
  };

  // Fetch appointments
  const { data, isLoading, isError } = useQuery({
    queryKey: ["receivedAppointments", queryParams],
    queryFn: () => appointmentServices.getAllReceivedAppointments(queryParams),
  });

  const appointments: AppointmentInterface[] = data?.data?.items ?? [];
  const totalCount = data?.data?.totalCount ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  // Confirm mutation
  const confirmMutation = useMutation({
    mutationFn: (id: string) => appointmentServices.confirmAppointment(id),
    onMutate: (id) => setMutatingId(id),
    onSuccess: () => {
      toast.success("تم تأكيد الموعد بنجاح");
      queryClient.invalidateQueries({ queryKey: ["receivedAppointments"] });
    },
    onError: () => toast.error("حدث خطأ أثناء تأكيد الموعد"),
    onSettled: () => setMutatingId(null),
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: (id: string) => appointmentServices.rejectAppointment(id),
    onMutate: (id) => setMutatingId(id),
    onSuccess: () => {
      toast.success("تم رفض الموعد");
      queryClient.invalidateQueries({ queryKey: ["receivedAppointments"] });
    },
    onError: () => toast.error("حدث خطأ أثناء رفض الموعد"),
    onSettled: () => setMutatingId(null),
  });

  // Stat cards config
  const statCards: {
    key: StatusFilter;
    label: string;
    className: string;
  }[] = [
    {
      key: "all",
      label: "الكل",
      className: "bg-muted text-foreground",
    },
    {
      key: 0,
      label: "قيد الانتظار",
      className: "bg-amber-500/10 text-amber-700",
    },
    {
      key: 1,
      label: "مُؤكد",
      className: "bg-emerald-500/10 text-emerald-700",
    },
    {
      key: 2,
      label: "ملغي",
      className: "bg-red-500/10 text-red-700",
    },
    {
      key: 3,
      label: "مكتمل",
      className: "bg-blue-500/10 text-blue-700",
    },
  ];

  // Handlers
  const handleFilterChange = (key: StatusFilter) => {
    setStatusFilter(key);
    setCurrentPage(1);
  };

  const toggleSort = () => {
    setSortDescending((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* ── Status Filter Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <StatCard
            key={String(card.key)}
            label={card.label}
            count={
              card.key === "all" ? totalCount : 0 // Server-side count; "all" shows total
            }
            className={card.className}
            isActive={statusFilter === card.key}
            onClick={() => handleFilterChange(card.key)}
          />
        ))}
      </div>

      {/* ── Search Bar + Sort Control ── */}
      <form
        onSubmit={handleSubmit(onSearch)}
        className="flex flex-wrap gap-3 items-center bg-background border rounded-xl px-4 py-3"
      >
        {/* Search input */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-40">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            {...register("searchTerm")}
            placeholder="ابحث بالاسم..."
            className="text-xs bg-transparent outline-none flex-1 text-right border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Sort dropdown */}
        <Select
          dir="rtl"
          value={sortDescending ? "newest" : "oldest"}
          onValueChange={(value) => {
            setSortDescending(value === "newest");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="cursor-pointer w-36 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer justify-end" value="newest">
              الأحدث أولاً
            </SelectItem>
            <SelectItem className="cursor-pointer justify-end" value="oldest">
              الأقدم أولاً
            </SelectItem>
          </SelectContent>
        </Select>
      </form>

      {/* ── Appointments List ── */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="p-10 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">جاري تحميل الطلبات...</span>
            </div>
          </Card>
        ) : isError ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-red-500">
              حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.
            </p>
          </Card>
        ) : appointments.length === 0 ? (
          <Card className="p-10 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              لا توجد طلبات تطابق الفلتر المختار
            </p>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirm={(id) => confirmMutation.mutate(id)}
              onReject={(id) => rejectMutation.mutate(id)}
              isConfirming={
                confirmMutation.isPending && mutatingId === appointment.id
              }
              isRejecting={
                rejectMutation.isPending && mutatingId === appointment.id
              }
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="w-9 h-9"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsRequestsTab;
