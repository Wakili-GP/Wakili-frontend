import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  slotSchema,
  type SlotFormValues,
} from "@/schemas/appointment-slots.schema";
import appointmentSlotsServices, {
  type SlotInterface,
  type CreateSlotPayload,
  type UpdateSlotPayload,
} from "@/services/appointmentSlots-services";

const toISO = (d: Date) => d.toISOString().split("T")[0];

const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const toInputTime = (value: string) => value.slice(0, 5);

const toApiTime = (value: string) => `${value.slice(0, 5)}:00`;

const padTime = (n: number) => String(n).padStart(2, "0");

const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const value = `${padTime(hour)}:${padTime(minute)}`;
  return { value, label: value };
});

const dropdownTriggerClass =
  "h-9 rounded-lg border-border bg-background text-right shadow-sm";

const dropdownContentClass =
  "rounded-xl border border-border bg-background p-1.5 shadow-lg";

const dropdownItemClass =
  "cursor-pointer justify-end rounded-lg text-sm data-[highlighted]:bg-primary/10 data-[highlighted]:text-foreground";

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
  onCancel: () => void;
  onSave: (payload: UpdateSlotPayload) => void;
  isSaving: boolean;
}

const EditRow: React.FC<EditRowProps> = ({
  slot,
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
      startTime: toApiTime(values.startTime),
      endTime: toApiTime(values.endTime),
      sessionType: Number(values.sessionType) as 0 | 1,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-primary/30 rounded-xl px-4 py-3 bg-primary/5 space-y-3"
    >
      <p className="text-xs font-medium text-primary">تعديل الموعد</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
        {/* Session type */}
        <div className="space-y-1">
          <Label className="text-xs">نوع الجلسة</Label>
          <Controller
            control={control}
            name="sessionType"
            render={({ field }) => (
              <Select
                dir="rtl"
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className={`${dropdownTriggerClass} text-xs`}>
                  <SelectValue placeholder="نوع الجلسة" />
                </SelectTrigger>
                <SelectContent className={dropdownContentClass}>
                  <SelectItem value="0" className={dropdownItemClass}>
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      هاتفية
                    </span>
                  </SelectItem>
                  <SelectItem value="1" className={dropdownItemClass}>
                    <span className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-amber-600" />
                      مكتبية
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 gap-2">
          {/* Start */}
          <div className="space-y-1">
            <Label className="text-xs">وقت البدء</Label>
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={`${dropdownTriggerClass} text-xs`}>
                    <SelectValue placeholder="اختر وقت البدء" />
                  </SelectTrigger>
                  <SelectContent className={`${dropdownContentClass} max-h-64`}>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem
                        key={`edit-start-${time.value}`}
                        value={time.value}
                        className={dropdownItemClass}
                      >
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  dir="rtl"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={`${dropdownTriggerClass} text-xs`}>
                    <SelectValue placeholder="اختر وقت الانتهاء" />
                  </SelectTrigger>
                  <SelectContent className={`${dropdownContentClass} max-h-64`}>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem
                        key={`edit-end-${time.value}`}
                        value={time.value}
                        className={dropdownItemClass}
                      >
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
    queryKey: ["appointmentSlots", selectedDate],
    queryFn: () => appointmentSlotsServices.getSlotsByDate(selectedDate),
    enabled: !!selectedDate,
  });

  // Have to separate because there is no onSuccess callbak in useQuery
  const slots: SlotInterface[] = slotsResponse?.data ?? [];

  // Create Slot
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
    onError: () => toast.error("حدث خطأ أثناء إضافة الموعد"),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSlotPayload }) =>
      appointmentSlotsServices.updateSlot(id, payload),
    onSuccess: () => {
      toast.success("تم تعديل الموعد بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["appointmentSlots", selectedDate],
      });
      setEditingId(null);
    },
    onError: () => toast.error("حدث خطأ أثناء تعديل الموعد"),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentSlotsServices.deleteSlot(id),
    onSuccess: () => {
      toast.success("تم حذف الموعد");
      queryClient.invalidateQueries({
        queryKey: ["appointmentSlots", selectedDate],
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
    defaultValues: { sessionType: "0" },
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              {/* Session type */}
              <div className="space-y-1.5">
                <Label className="text-xs">نوع الجلسة</Label>
                <Controller
                  control={control}
                  name="sessionType"
                  render={({ field }) => (
                    <Select
                      dir="rtl"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={`${dropdownTriggerClass} text-sm cursor-pointer`}
                      >
                        <SelectValue placeholder="نوع الجلسة" />
                      </SelectTrigger>
                      <SelectContent className={dropdownContentClass}>
                        <SelectItem value="0" className={dropdownItemClass}>
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-500" />
                            هاتفية
                          </span>
                        </SelectItem>
                        <SelectItem value="1" className={dropdownItemClass}>
                          <span className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-amber-600" />
                            مكتبية
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                {/* Start time */}
                <div className="space-y-1.5">
                  <Label className="text-xs">وقت البدء</Label>
                  <Controller
                    control={control}
                    name="startTime"
                    render={({ field }) => (
                      <Select
                        dir="rtl"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`${dropdownTriggerClass} text-sm cursor-pointer`}
                        >
                          <SelectValue placeholder="اختر وقت البدء" />
                        </SelectTrigger>
                        <SelectContent
                          className={`${dropdownContentClass} max-h-64`}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem
                              key={`create-start-${time.value}`}
                              value={time.value}
                              className={dropdownItemClass}
                            >
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select
                        dir="rtl"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={`${dropdownTriggerClass} text-sm cursor-pointer`}
                        >
                          <SelectValue placeholder="اختر وقت الانتهاء" />
                        </SelectTrigger>
                        <SelectContent
                          className={`${dropdownContentClass} max-h-64`}
                        >
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem
                              key={`create-end-${time.value}`}
                              value={time.value}
                              className={dropdownItemClass}
                            >
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
