import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Clock,
  Building,
  Plus,
  Trash2,
  Loader2,
  CalendarIcon,
  Pencil,
  Check,
  Phone,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { slotSchema, type SlotFormValues } from "@/schemas/time-slots.schema";
import timeSlotsServices, {
  type SlotInterface,
  type CreateSlotPayload,
  type UpdateSlotPayload,
} from "@/services/timeSlots-services";
const toISO = (d: Date) => d.toISOString().split("T")[0];

const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const toInputTime = (value: string) => value.slice(0, 5);

const toApiTime = (value: string) => `${value.slice(0, 5)}:00`;

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
    <Phone className="w-3.5 h-3.5 text-blue-500" />
  ) : (
    <Building className="w-3.5 h-3.5 text-amber-600" />
  );

interface EditRowProps {
  slot: SlotInterface;
  selectedDate: string;
  onCancel: () => void;
  onSave: (payload: UpdateSlotPayload) => void;
  isSaving: boolean;
}

const EditRow: React.FC<EditRowProps> = ({
  slot,
  selectedDate,
  onCancel,
  onSave,
  isSaving,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SlotFormValues>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      startTime: toInputTime(slot.startTime),
      endTime: toInputTime(slot.endTime),
      sessionType: String(slot.sessionType) as "0" | "1",
    },
  });

  const onSubmit = (values: SlotFormValues) => {
    onSave({
      date: (slot as any).date || selectedDate,
      startTime: toApiTime(values.startTime),
      endTime: toApiTime(values.endTime),
      sessionType: Number(values.sessionType) as 0 | 1,
    } as any);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-primary/30 rounded-xl px-4 py-3 bg-primary/5 space-y-3"
    >
      <p className="text-xs font-medium text-primary">تعديل الموعد</p>
      <div className="grid grid-cols-1 gap-3">
        {/* Session type */}
        <div className="space-y-2">
          <Label className="text-xs">نوع الجلسة</Label>
          <Controller
            control={control}
            name="sessionType"
            render={({ field }) => (
              <div className="flex items-center gap-4 border rounded-lg p-2 bg-background w-fit">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="accent-primary"
                    value="0"
                    checked={field.value === "0"}
                    onChange={field.onChange}
                  />
                  <span className="text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    هاتفية
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer border-r pr-4 border-border">
                  <input
                    type="radio"
                    className="accent-primary"
                    value="1"
                    checked={field.value === "1"}
                    onChange={field.onChange}
                  />
                  <span className="text-xs flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    مكتبية
                  </span>
                </label>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Start */}
          <div className="space-y-1">
            <Label className="text-xs">وقت البدء</Label>
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <Input
                  type="time"
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  dir="ltr"
                  {...field}
                />
              )}
            />
            {errors.startTime && (
              <p className="text-[10px] text-red-500">
                {errors.startTime.message}
              </p>
            )}
          </div>

          {/* End */}
          <div className="space-y-1">
            <Label className="text-xs">وقت الانتهاء</Label>
            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <Input
                  type="time"
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  dir="ltr"
                  {...field}
                />
              )}
            />
            {errors.endTime && (
              <p className="text-[10px] text-red-500">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isSaving}
          className="h-8 px-3 text-xs"
        >
          <X className="w-3.5 h-3.5 ml-1" />
          إلغاء
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          className="h-8 px-3 text-xs"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 ml-1 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5 ml-1" />
          )}
          حفظ التعديل
        </Button>
      </div>
    </form>
  );
};

const AppointmentsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const selectedDate = toISO(selectedDay);

  // Fetch Slots By Date
  const {
    data: slotsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["timeSlots", selectedDate],
    queryFn: () => timeSlotsServices.getSlotsByDate(selectedDate),
    enabled: !!selectedDate,
    refetchOnWindowFocus: true,
  });

  // Have to separate because there is no onSuccess callbak in useQuery
  const slots: SlotInterface[] = slotsResponse?.data ?? [];

  // Create Slot
  const createMutation = useMutation({
    mutationFn: (payload: CreateSlotPayload) =>
      timeSlotsServices.createSlot(payload),
    onSuccess: () => {
      toast.success("تم إضافة الموعد بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", selectedDate],
      });
      reset();
    },
    onError: (err: Error) =>
      toast.error(err.message || "حدث خطأ أثناء إضافة الموعد"),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSlotPayload }) =>
      timeSlotsServices.updateSlot(id, payload),
    onSuccess: () => {
      toast.success("تم تعديل الموعد بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", selectedDate],
      });
      setEditingId(null);
    },
    onError: () => toast.error("حدث خطأ أثناء تعديل الموعد"),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => timeSlotsServices.deleteSlot(id),
    onSuccess: () => {
      toast.success("تم حذف الموعد");
      queryClient.invalidateQueries({
        queryKey: ["timeSlots", selectedDate],
      });
    },
    onError: () => toast.error("حدث خطأ أثناء حذف الموعد"),
  });

  // Create Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SlotFormValues>({
    resolver: zodResolver(slotSchema),
    defaultValues: { sessionType: "0", startTime: "09:00", endTime: "09:30" },
  });

  const onSubmit = (values: SlotFormValues) => {
    createMutation.mutate({
      date: selectedDate,
      startTime: toApiTime(values.startTime),
      endTime: toApiTime(values.endTime),
      sessionType: Number(values.sessionType) as 0 | 1,
    });
  };

  return (
    <div dir="rtl" className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">مواعيدي</h2>
      </div>

      {/* Top row: form + calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
        {/* Add form */}
        <Card className="p-4 space-y-4">
          <p className="flex items-center gap-1.5 font-semibold text-sm text-muted-foreground">
            <Plus className="w-4 h-4 text-primary" />
            إضافة موعد جديد
          </p>

          {/* Selected date chip */}
          <div className="inline-flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
            {formatArabicDate(selectedDay)}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Session type */}
              <div className="space-y-2">
                <Label className="text-xs">نوع الجلسة</Label>
                <Controller
                  control={control}
                  name="sessionType"
                  render={({ field }) => (
                    <div className="flex items-center gap-4 border rounded-lg p-2.5 bg-background w-fit">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          className="accent-primary w-4 h-4"
                          value="0"
                          checked={field.value === "0"}
                          onChange={field.onChange}
                        />
                        <span className="text-sm flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-blue-500" />
                          هاتفية
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer border-r pr-4 border-border">
                        <input
                          type="radio"
                          className="accent-primary w-4 h-4"
                          value="1"
                          checked={field.value === "1"}
                          onChange={field.onChange}
                        />
                        <span className="text-sm flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-amber-600" />
                          مكتبية
                        </span>
                      </label>
                    </div>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start time */}
                <div className="space-y-1.5">
                  <Label className="text-xs">وقت البدء</Label>
                  <Controller
                    control={control}
                    name="startTime"
                    render={({ field }) => (
                      <Input
                        type="time"
                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        dir="ltr"
                        {...field}
                      />
                    )}
                  />
                  {errors.startTime && (
                    <p className="text-[10px] text-red-500">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>

                {/* End time */}
                <div className="space-y-1.5">
                  <Label className="text-xs">وقت الانتهاء</Label>
                  <Controller
                    control={control}
                    name="endTime"
                    render={({ field }) => (
                      <Input
                        type="time"
                        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        dir="ltr"
                        {...field}
                      />
                    )}
                  />
                  {errors.endTime && (
                    <p className="text-[10px] text-red-500">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full h-9"
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

        {/* Compact calendar */}
        <Card className="p-3">
          <Calendar
            mode="single"
            selected={selectedDay}
            disabled={isPastDate}
            onSelect={(day) => {
              if (day) {
                setSelectedDay(day);
                setEditingId(null);
              }
            }}
            dir="rtl"
            className="rounded-md"
          />
        </Card>
      </div>

      {/* Slots list */}
      <Card className="p-4 space-y-3">
        {/* Section header */}
        <div className="flex items-center gap-2 pb-2 border-b">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">
            المواعيد المتاحة – {formatArabicDate(selectedDay)}
          </span>
          {!isLoading && !isError && (
            <Badge variant="secondary" className="mr-auto text-xs">
              {slots.length} موعد
            </Badge>
          )}
        </div>

        {/* States */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">جاري التحميل...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500 text-sm">
            حدث خطأ أثناء تحميل المواعيد. يرجى المحاولة مرة أخرى.
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
            <CalendarIcon className="w-8 h-8 opacity-25" />
            <p className="text-sm">لا توجد مواعيد متاحة في هذا اليوم</p>
          </div>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) =>
              editingId === slot.id ? (
                <EditRow
                  key={slot.id}
                  slot={slot}
                  selectedDate={selectedDate}
                  onCancel={() => setEditingId(null)}
                  onSave={(payload) =>
                    updateMutation.mutate({ id: slot.id, payload })
                  }
                  isSaving={updateMutation.isPending}
                />
              ) : (
                <div
                  key={slot.id}
                  className="flex items-center justify-between border rounded-xl px-4 py-2.5 hover:bg-muted/30 transition-colors"
                >
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <SessionTypeIcon type={slot.sessionType} />
                    </div>
                    <div>
                      <p className="text-xs font-medium">
                        {sessionTypeLabel(slot.sessionType)}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {slot.startTime} – {slot.endTime}
                      </p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => setEditingId(slot.id)}
                      title="تعديل الموعد"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(slot.id)}
                      title="حذف الموعد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AppointmentsTab;
