import { useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";

import {
  Phone,
  Building,
  User,
  CreditCard,
  Clock,
  Calendar,
  X,
  Loader2,
  CalendarDays,
  Banknote,
  Hash,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import calendarServices, {
  type CalendarAppointment,
  type CalendarView,
  APPOINTMENT_TYPE_MAP,
  PAYMENT_METHOD_MAP,
} from "@/services/calendar-services";
import "@/styles/fullcalendar.css";

// ─── Arabic locale object (inline – no extra dependency) ─────────
const arLocale = {
  code: "ar",
  direction: "rtl" as const,
  buttonText: {
    today: "اليوم",
    month: "شهر",
    week: "أسبوع",
    day: "يوم",
    list: "قائمة",
    prev: "السابق",
    next: "التالي",
  },
  weekText: "أسبوع",
  allDayText: "طوال اليوم",
  moreLinkText: (n: number) => `+${n} مواعيد أخرى`,
  noEventsText: "لا توجد مواعيد للعرض",
};

// ─── Helpers ─────────────────────────────────────────────────────
const formatDateAr = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTimeAr = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

// ─── Appointment Detail Card (sidebar popup) ─────────────────────
interface AppointmentDetailProps {
  appointment: CalendarAppointment;
  onClose: () => void;
}

const AppointmentDetail = ({
  appointment,
  onClose,
}: AppointmentDetailProps) => {
  const typeInfo = APPOINTMENT_TYPE_MAP[appointment.appointmentType];
  const fullName = `${appointment.clientFirstName} ${appointment.clientLastName}`;

  return (
    <Card className="absolute left-4 top-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] shadow-elegant animate-scale-in overflow-hidden">
      {/* Header gradient */}
      <div className="bg-gradient-primary px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary-foreground">
          <CalendarDays className="w-5 h-5" />
          <h3 className="font-bold text-sm">تفاصيل الموعد</h3>
        </div>
        <button
          onClick={onClose}
          className="text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Client info */}
        <div className="flex items-center gap-3">
          {appointment.clientProfileImage ? (
            <img
              src={appointment.clientProfileImage}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-muted shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{fullName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" />
              <span dir="ltr">{appointment.clientPhoneNumber}</span>
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Appointment ID */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <Hash className="w-3 h-3" />
              رقم الموعد
            </p>
            <p className="text-xs font-semibold truncate" dir="ltr">
              {appointment.appointmentId.slice(0, 8)}...
            </p>
          </div>

          {/* Type */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium">
              نوع الجلسة
            </p>
            <Badge
              variant="outline"
              className={`text-[10px] ${typeInfo.bgClass}`}
            >
              {appointment.appointmentType === 0 ? (
                <Phone className="w-3 h-3 ml-1" />
              ) : (
                <Building className="w-3 h-3 ml-1" />
              )}
              {typeInfo.label}
            </Badge>
          </div>

          {/* Date */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              التاريخ
            </p>
            <p className="text-xs font-semibold">
              {formatDateAr(appointment.startDate)}
            </p>
          </div>

          {/* Time */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              الوقت
            </p>
            <p className="text-xs font-semibold">
              {formatTimeAr(appointment.startDate)} –{" "}
              {formatTimeAr(appointment.endDate)}
            </p>
          </div>

          {/* Price */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <Banknote className="w-3 h-3" />
              سعر الجلسة
            </p>
            <p className="text-xs font-bold text-emerald-600">
              {appointment.sessionPrice.toLocaleString("ar-EG")} ج.م
            </p>
          </div>

          {/* Payment */}
          <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              طريقة الدفع
            </p>
            <p className="text-xs font-semibold">
              {PAYMENT_METHOD_MAP[appointment.paymentMethod]}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CalendarTab = () => {
  const calendarRef = useRef<FullCalendar>(null);

  const [currentView, setCurrentView] = useState<CalendarView>("dayGridMonth");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [selectedAppointment, setSelectedAppointment] =
    useState<CalendarAppointment | null>(null);

  // Fetch appointments using the current view & date range
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "calendarAppointments",
      currentView,
      dateRange.start,
      dateRange.end,
    ],
    queryFn: () =>
      calendarServices.getCalendarAppointments({
        View: currentView,
        Start: dateRange.start,
        End: dateRange.end,
      }),
    enabled: !!dateRange.start && !!dateRange.end,
  });

  const appointments: CalendarAppointment[] = data?.data ?? [];

  // Transform appointments → FullCalendar events
  const calendarEvents = appointments.map((apt) => {
    const typeInfo = APPOINTMENT_TYPE_MAP[apt.appointmentType];
    return {
      id: apt.appointmentId,
      title: `${apt.clientFirstName} ${apt.clientLastName}`,
      start: apt.startDate,
      end: apt.endDate,
      backgroundColor: typeInfo.color,
      textColor: "#fff",
      extendedProps: { appointment: apt },
    };
  });

  // When FullCalendar changes the visible date range or view
  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    const viewType = arg.view.type as CalendarView;
    setCurrentView(viewType);
    setDateRange({
      start: arg.startStr,
      end: arg.endStr,
    });
    setSelectedAppointment(null);
  }, []);

  // When user clicks an event
  const handleEventClick = useCallback((arg: EventClickArg) => {
    const apt = arg.event.extendedProps.appointment as CalendarAppointment;
    setSelectedAppointment((prev) =>
      prev?.appointmentId === apt.appointmentId ? null : apt,
    );
  }, []);

  return (
    <div className="space-y-5 relative" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">التقويم</h2>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-background/50 backdrop-blur-[2px] flex items-center justify-center rounded-xl pointer-events-none">
          <div className="flex items-center gap-2 text-primary bg-background px-4 py-2 rounded-lg shadow-card">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">جاري التحميل...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card className="p-6 text-center border-red-200 bg-red-50/30">
          <p className="text-sm text-red-500 font-medium">
            حدث خطأ أثناء تحميل المواعيد. يرجى المحاولة مرة أخرى.
          </p>
        </Card>
      )}

      {/* Calendar Card */}
      <Card className="p-4 md:p-6 overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          locale={arLocale}
          direction="rtl"
          firstDay={6} /* Saturday first */
          headerToolbar={{
            right: "prev,next today",
            center: "title",
            left: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          buttonText={{
            today: "اليوم",
            month: "شهر",
            week: "أسبوع",
            day: "يوم",
            list: "قائمة",
          }}
          noEventsText="لا توجد مواعيد للعرض"
          allDayText="طوال اليوم"
          moreLinkText={(n) => `+${n} أخرى`}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }}
          height="auto"
          contentHeight="auto"
          dayMaxEvents={3}
          navLinks
          nowIndicator
          selectable={false}
          editable={false}
          events={calendarEvents}
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          eventDisplay="block"
        />
      </Card>

      {/* Appointment detail popup */}
      {selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default CalendarTab;
