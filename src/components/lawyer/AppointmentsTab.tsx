import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Clock,
  Phone,
  Building,
  Plus,
  Trash2,
  Loader2,
  CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import appointmentSlotsServices, {
  type SlotInterface,
  type CreateSlotPayload,
} from "@/services/appointmentSlots-services";

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
const createSlotSchema = z
  .object({
    startTime: z.string().min(1, "وقت البدء مطلوب"),
    endTime: z.string().min(1, "وقت الانتهاء مطلوب"),
    sessionType: z.enum(["0", "1"]),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "يجب أن يكون وقت البدء قبل وقت الانتهاء",
    path: ["endTime"],
  });

type CreateSlotFormValues = z.infer<typeof createSlotSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const toISO = (d: Date) => d.toISOString().split("T")[0];

const sessionTypeLabel = (type: 0 | 1) =>
  type === 0 ? "استشارة هاتفية" : "استشارة مكتبية";

const formatArabicDate = (date: Date) =>
  date.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const SessionTypeIcon = ({ type }: { type: 0 | 1 }) =>
  type === 0 ? (
    <Phone className="w-4 h-4 text-blue-500" />
  ) : (
    <Building className="w-4 h-4 text-amber-600" />
  );

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const AppointmentsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const selectedDate = toISO(selectedDay);

  // ── Fetch slots ────────────────────────────────────────────────────────
  const {
    data: slotsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["appointmentSlots", selectedDate],
    queryFn: () => appointmentSlotsServices.getSlotsByDate(selectedDate),
    enabled: !!selectedDate,
  });

  const slots: SlotInterface[] = slotsResponse?.data ?? [];

  // ── Create ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateSlotPayload) =>
      appointmentSlotsServices.createSlot(payload),
    onSuccess: () => {
      toast.success("تم إضافة الموعد بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["appointmentSlots", selectedDate],
      });
      reset();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إضافة الموعد");
    },
  });

  // ── Delete ─────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentSlotsServices.deleteSlot(id),
    onSuccess: () => {
      toast.success("تم حذف الموعد");
      queryClient.invalidateQueries({
        queryKey: ["appointmentSlots", selectedDate],
      });
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الموعد");
    },
  });

  // ── Form ───────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSlotFormValues>({
    resolver: zodResolver(createSlotSchema),
    defaultValues: { sessionType: "0" },
  });

  const onSubmit = (values: CreateSlotFormValues) => {
    const payload: CreateSlotPayload = {
      date: selectedDate,
      startTime: values.startTime,
      endTime: values.endTime,
      sessionType: Number(values.sessionType) as 0 | 1,
    };
    createMutation.mutate(payload);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="space-y-6">
      {/* ── Page title ── */}
      <div className="flex items-center gap-2">
        <Clock className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">مواعيدي</h2>
      </div>

      {/* ── Two-column: Form (right ~70%) + Calendar (left ~30%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_30%] gap-6">
        {/* ── Add Slot Form (right in RTL) ── */}
        <Card className="p-5 flex flex-col gap-5">
          <p className="flex items-center gap-2 font-semibold text-base">
            <Plus className="w-4 h-4 text-primary" />
            إضافة موعد جديد
          </p>

          {/* Selected date display */}
          <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-3 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span>{formatArabicDate(selectedDay)}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Session Type */}
            <div className="space-y-1.5">
              <Label htmlFor="session-type">نوع الجلسة</Label>
              <select
                id="session-type"
                {...register("sessionType")}
                className="w-full border rounded-md h-10 px-3 text-sm bg-background text-right"
              >
                <option value="0">📞 استشارة هاتفية</option>
                <option value="1">🏢 استشارة مكتبية</option>
              </select>
            </div>

            {/* Times row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="start-time">وقت البدء</Label>
                <Input
                  id="start-time"
                  type="time"
                  {...register("startTime")}
                  className="text-center"
                />
                {errors.startTime && (
                  <p className="text-xs text-red-500">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end-time">وقت الانتهاء</Label>
                <Input
                  id="end-time"
                  type="time"
                  {...register("endTime")}
                  className="text-center"
                />
                {errors.endTime && (
                  <p className="text-xs text-red-500">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 ml-2" />
              )}
              إضافة الموعد
            </Button>
          </form>
        </Card>

        {/* ── Calendar (left in RTL, ~30%) ── */}
        <Card className="p-4 flex flex-col gap-3">
          <p className="flex items-center gap-2 font-semibold text-base">
            <CalendarIcon className="w-4 h-4 text-primary" />
            اختر تاريخ الموعد
          </p>
          <Calendar
            mode="single"
            selected={selectedDay}
            onSelect={(day) => day && setSelectedDay(day)}
            dir="rtl"
            className="rounded-md w-full"
          />
        </Card>
      </div>

      {/* ── Slots for selected date ── */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="font-semibold">
            المواعيد المتاحة – {formatArabicDate(selectedDay)}
          </span>
          {!isLoading && !isError && (
            <Badge variant="secondary" className="mr-auto">
              {slots.length} موعد
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري التحميل...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 text-sm">
            حدث خطأ أثناء تحميل المواعيد. يرجى المحاولة مرة أخرى.
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
            <CalendarIcon className="w-10 h-10 opacity-30" />
            <p className="text-sm">لا توجد مواعيد متاحة في هذا اليوم</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between border rounded-lg px-4 py-3 hover:shadow-sm transition-shadow bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <SessionTypeIcon type={slot.sessionType} />
                  </div>
                  <div className="space-y-0.5">
                    <Badge variant="outline" className="text-xs">
                      {sessionTypeLabel(slot.sessionType)}
                    </Badge>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {slot.startTime} – {slot.endTime}
                    </p>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(slot.id)}
                  title="حذف الموعد"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AppointmentsTab;
