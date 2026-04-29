import { Calendar } from "@/components/ui/calendar";
import { arEG } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MessageSquare,
  Loader2,
  CreditCard,
  Clock,
  Video,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import paymentServices from "@/services/payment-services";
import { toast } from "sonner";
import { useAuth } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/auth-modal.store";

interface LawyerInfo {
  lawyerId: string;
  laweryFirstName: string;
  lawyerLastName: string;
  lawyerProfileImage: string;
}
interface PaymentCalendarProps {
  lawyer: LawyerInfo;
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
  lawyer,
  phonePrice,
  officePrice,
}: PaymentCalendarProps) => {
  const { user, isAuthenticated } = useAuth();
  const { openRegister } = useAuthModalStore();
  const isOwner = user?.id === lawyer.lawyerId;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<0 | 1>(1); // 0 for phone, 1 for office
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePayment = async () => {
    const slot = availableTimes?.find((s) => s.startTime === selectedTime);
    if (!slot) return;

    setIsRedirecting(true);
    try {
      const url = await paymentServices.getPaymentLink(
        slot.id,
        lawyer.lawyerId,
      );
      window.open(url, "_blank");
    } catch (error: unknown) {
      console.log("Error during payment process:", error);
      toast.error("حدث خطأ أثناء إعداد عملية الدفع. يرجى المحاولة مرة أخرى.");
      setIsRedirecting(false);
    }
  };

  const { data: availableTimes, isLoading } = useQuery({
    queryKey: [
      "availableSlots",
      lawyer.lawyerId,
      selectedDate,
      selectedSessionType,
    ],
    queryFn: () =>
      paymentServices.getAvailableSlots(
        lawyer.lawyerId,
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
                      onClick={() =>
                        setSelectedTime((prev) =>
                          prev === slot.startTime ? null : slot.startTime,
                        )
                      }
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
            {!isOwner && (
              <Button
                disabled={!selectedTime}
                className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover font-semibold h-12 text-base"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.info("يرجى تسجيل الدخول للحجز");
                    openRegister();
                    return;
                  }
                  setBookingModalOpen(true);
                }}
              >
                <CalendarIcon className="w-5 h-5 ml-2" /> احجز جلسة
              </Button>
            )}
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

      {/* Booking Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-xl text-center">
              تأكيد حجز الجلسة
            </DialogTitle>
            <DialogDescription className="text-center">
              راجع تفاصيل الموعد قبل المتابعة إلى الدفع.
            </DialogDescription>
          </DialogHeader>

          {/* Lawyer summary */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
            {lawyer.lawyerProfileImage ? (
              <img
                src={lawyer.lawyerProfileImage}
                alt={`${lawyer.laweryFirstName} ${lawyer.lawyerLastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-secondary/40"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-secondary/40">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {lawyer.laweryFirstName} {lawyer.lawyerLastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">محامي</p>
            </div>
            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
          </div>

          {/* Appointment info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                التاريخ
              </div>
              <p className="text-sm font-semibold text-foreground">
                {selectedDate?.toLocaleDateString("ar-EG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5" />
                الوقت
              </div>
              <p className="text-sm font-semibold text-foreground">
                {selectedTime ? selectedTime.slice(0, 5) : ""} -{" "}
                {selectedTime
                  ? availableTimes
                    ?.find((s) => s.startTime === selectedTime)
                    ?.endTime.slice(0, 5)
                  : ""}
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Video className="w-3.5 h-3.5" />
                نوع الجلسة
              </div>
              <p className="text-sm font-semibold text-foreground">
                {selectedSessionType === 0
                  ? "استشارة هاتفية"
                  : "استشارة مكتبية"}
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                السعر
              </div>
              <p className="text-sm font-bold text-primary">
                ${selectedSessionType === 0 ? phonePrice : officePrice}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  /ساعة
                </span>
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-secondary/30">
            <span className="text-sm font-semibold text-foreground">
              الإجمالي
            </span>
            <span className="text-lg font-bold text-foreground">
              ${selectedSessionType === 0 ? phonePrice : officePrice}
            </span>
          </div>

          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setBookingModalOpen(false)}
              className="flex-1"
              disabled={isRedirecting}
            >
              إلغاء
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isRedirecting}
              className="flex-1 h-11 bg-gradient-to-r from-[#F26E21] to-[#F8A23C] text-white hover:opacity-95 hover:shadow-lg font-semibold shadow-md transition-all duration-300 group"
            >
              {isRedirecting ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
              )}
              <span>{isRedirecting ? "جاري التحويل..." : "ادفع عبر"}</span>
              {!isRedirecting && (
                <span className="font-extrabold tracking-tight ml-1">
                  Paymob
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
