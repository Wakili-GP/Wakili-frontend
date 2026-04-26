import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Building2,
  CreditCard,
  Download,
  ArrowLeft,
  Sparkles,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface BookingDetails {
  bookingId: string;
  lawyerName: string;
  lawyerImage?: string;
  lawyerSpecialty: string;
  sessionType: string;
  sessionMethod: "video" | "phone" | "in-person";
  pricePaid: number;
  currency: string;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  country: string;
  paymentMethod: string;
  transactionId: string;
  clientEmail: string;
}

const defaultBooking: BookingDetails = {
  bookingId: "BK-2026-0428-1742",
  lawyerName: "د. أحمد المنصوري",
  lawyerImage: "",
  lawyerSpecialty: "قانون الشركات والأعمال",
  sessionType: "استشارة قانونية تخصصية",
  sessionMethod: "video",
  pricePaid: 450,
  currency: "SAR",
  date: "2026-05-03",
  startTime: "14:00",
  endTime: "15:00",
  city: "الرياض",
  country: "المملكة العربية السعودية",
  paymentMethod: "Visa •••• 4242",
  transactionId: "TXN-9F8A7B6C5D4E",
  clientEmail: "client@example.com",
};

const sessionMethodConfig = {
  video: { icon: Video, label: "جلسة مرئية", color: "text-blue-500" },
  phone: { icon: Phone, label: "مكالمة هاتفية", color: "text-green-500" },
  "in-person": {
    icon: Building2,
    label: "لقاء حضوري",
    color: "text-purple-500",
  },
};

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking] = useState<BookingDetails>(
    (location.state as BookingDetails) ?? defaultBooking,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const methodInfo = sessionMethodConfig[booking.sessionMethod];
  const MethodIcon = methodInfo.icon;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const handleDownloadReceipt = () => {
    toast({
      title: "تم تحميل الإيصال",
      description: "تم إرسال نسخة إلى بريدك الإلكتروني أيضاً.",
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12 px-4"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        {/* Success Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-glow mb-6 relative"
          >
            <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
              transition={{
                delay: 0.4,
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent"
          >
            تم تأكيد الحجز بنجاح!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            تم استلام الدفعة وحجز موعدك
          </motion.p>
        </motion.div>

        {/* Main Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="overflow-hidden border-2 shadow-elegant">
            {/* Lawyer Header */}
            <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent p-6 border-b">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 ring-4 ring-background shadow-lg">
                  <AvatarImage
                    src={booking.lawyerImage}
                    alt={booking.lawyerName}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {booking.lawyerName.split(" ")[1]?.[0] ??
                      booking.lawyerName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">
                    المحامي
                  </div>
                  <h2 className="text-2xl font-bold">{booking.lawyerName}</h2>
                  <Badge variant="secondary" className="mt-2">
                    {booking.lawyerSpecialty}
                  </Badge>
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">رقم الحجز</div>
                  <div className="font-mono text-sm font-semibold">
                    {booking.bookingId}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  تفاصيل الجلسة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<Sparkles className="w-4 h-4" />}
                    label="نوع الجلسة"
                    value={booking.sessionType}
                  />
                  <DetailItem
                    icon={
                      <MethodIcon className={`w-4 h-4 ${methodInfo.color}`} />
                    }
                    label="طريقة التواصل"
                    value={methodInfo.label}
                  />
                  <DetailItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="التاريخ"
                    value={formatDate(booking.date)}
                  />
                  <DetailItem
                    icon={<Clock className="w-4 h-4" />}
                    label="الوقت"
                    value={`${booking.startTime} - ${booking.endTime}`}
                  />
                  <DetailItem
                    icon={<MapPin className="w-4 h-4" />}
                    label="المدينة"
                    value={booking.city}
                  />
                  <DetailItem
                    icon={<Building2 className="w-4 h-4" />}
                    label="الدولة"
                    value={booking.country}
                  />
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  ملخص الدفع
                </h3>
                <div className="bg-muted/40 rounded-lg p-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">طريقة الدفع</span>
                    <span className="font-medium">{booking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">رقم العملية</span>
                    <span className="font-mono text-xs">
                      {booking.transactionId}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">المبلغ المدفوع</span>
                    <div className="text-2xl font-bold text-primary">
                      {booking.pricePaid.toLocaleString("ar-SA")}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        {booking.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Confirmation Email */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div className="text-sm">
                  تم إرسال تأكيد الحجز إلى{" "}
                  <span className="font-semibold">{booking.clientEmail}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-muted/20 border-t flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadReceipt}
                className="flex-1"
              >
                <Download className="w-4 h-4 ml-2" />
                تحميل الإيصال
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة إلى الموقع
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Secondary Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          هل تحتاج مساعدة؟{" "}
          <Link
            to="/profile"
            className="text-primary hover:underline font-medium"
          >
            اذهب إلى حجوزاتي
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="font-medium text-sm truncate">{value}</div>
    </div>
  </div>
);

export default BookingConfirmation;
