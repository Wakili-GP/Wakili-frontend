import { Calendar } from "@/components/ui/calendar";
import { arEG } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import paymentServices from "@/services/payment-services";
import { toast } from "sonner";

interface PaymentCalendarProps {
  lawyerId: string;
  phonePrice: number;
  officePrice: number;
}

// TO CONVERT ISO INTO YYYY-MM-DD
const toLocalISO = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PaymentCalendar = ({
  lawyerId,
  phonePrice,
  officePrice,
}: PaymentCalendarProps) => {
  console.log("PaymentCalendar rendered with lawyerId:", lawyerId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<0 | 1>(1); // 0 for phone, 1 for office

  const { data: availableTimes, isLoading } = useQuery({
    queryKey: ["availableSlots", lawyerId, selectedDate, selectedSessionType],
    queryFn: () =>
      paymentServices.getAvailableSlots(
        lawyerId,
        selectedDate ? toLocalISO(selectedDate) : "",
        selectedSessionType,
      ),
    enabled: !!selectedDate,
  });

  return (
    <div className="lg:w-[360px] shrink-0">
      <div className="lg:sticky lg:top-24 space-y-6">
        <Card className="p-6 shadow-md">
          <div className="mb-6">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-3">
              أسعار الجلسات
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground">هاتفية</p>
                <p className="text-lg font-bold text-foreground">
                  ${phonePrice}
                </p>
                <p className="text-[11px] text-muted-foreground">/ساعة</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground">مكتبية</p>
                <p className="text-lg font-bold text-foreground">
                  ${officePrice}
                </p>
                <p className="text-[11px] text-muted-foreground">/ساعة</p>
              </div>
            </div>
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
              disabled={(date) =>
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
              locale={arEG}
              dir="rtl"
              className="rounded-lg border w-full"
            />
          </div>
          {selectedDate && (
            <div className="mb-4">
              <div className="mb-4 rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  التاريخ المختار
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {selectedDate.toLocaleDateString("ar-EG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    نوع الجلسة
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer">
                      <div>
                        <p className="text-sm font-medium">هاتفية</p>
                        <p className="text-[11px] text-muted-foreground">
                          ${phonePrice} / ساعة
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="sessionType"
                        checked={selectedSessionType === 0}
                        onChange={() => setSelectedSessionType(0)}
                      />
                    </label>
                    <label className="flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer">
                      <div>
                        <p className="text-sm font-medium">مكتبية</p>
                        <p className="text-[11px] text-muted-foreground">
                          ${officePrice} / ساعة
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="sessionType"
                        checked={selectedSessionType === 1}
                        onChange={() => setSelectedSessionType(1)}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-3">
                الأوقات المتاحة
              </h4>
              {isLoading ? (
                <div className="text-xs text-muted-foreground text-center py-4">
                  جاري تحميل الأوقات...
                </div>
              ) : availableTimes && availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((slot) => (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={
                        selectedTime === slot.startTime ? "default" : "outline"
                      }
                      className="h-9 cursor-pointer text-xs"
                      onClick={() => setSelectedTime(slot.startTime)}
                    >
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground text-center">
                  لا توجد مواعيد متاحة في هذا اليوم.
                </div>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Button
              className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover font-semibold h-12 text-base"
              // I will fix this later to connect it to the booking flow. Not now
            >
              <CalendarIcon className="w-5 h-5 ml-2" /> احجز جلسة
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold h-12 text-base"
              onClick={() =>
                toast.info("سنضيف هذه الخاصية لاحقا", {
                  description: "سيتم إضافة هذه الخاصية في المستقبل.",
                })
              }
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
  );
};

export default PaymentCalendar;

{
  /* ── Send Message Modal [I will add those modal later] ── */
}
{
  /* <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
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
      </Dialog> */
}
