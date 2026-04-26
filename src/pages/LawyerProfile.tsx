import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import lawyerProfileServices, {
  type LawyerProfileResponse,
} from "@/services/lawyerProfile-services";
import {
  Award,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Flag,
  MapPin,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  Star,
  Loader2,
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
import { arEG } from "date-fns/locale";
import MainNavbar from "@/components/MainNavbar";
import BlueFooter from "@/components/BlueFooter";
import ReviewsTab from "@/components/LawyerDashboard/ReviewsTab";

const LawyerProfile = () => {
  // Fetching the ID from the URL to fetch the profile
  const { id } = useParams<{ id: string }>();

  // Local state for the active tab
  const [activeTab, setActiveTab] = useState("bio");

  // States for the booking form. Later, I will connect these states to the backend to fetch available times and book sessions. Not now
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<
    "phone" | "office"
  >("office");
  // Just a Mock Data, I will delete later once I connect to the backend
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    // Mock logic to generate available times based on the selected date and session type
    const times = [];
    const baseHour = selectedSessionType === "phone" ? 9 : 10; // Phone sessions start at 9 AM, office sessions start at 10 AM
    for (let i = 0; i < 8; i++) {
      const hour = baseHour + i;
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  }, [selectedDate, selectedSessionType]);

  // Fetching Profile Data
  const {
    data: lawyerProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lawyerProfile", id],
    queryFn: () => lawyerProfileServices.getLawyerProfile(id as string),
    enabled: !!id,
  });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-bold">
          فشل في تحميل بيانات المحامي
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "bio", label: "السيرة والخبرات" },
    { id: "education", label: "التعليم" },
    { id: "reviews", label: "التقييمات" },
  ];

  // To make sure that the lawyerProfile inside the JSX below is not undefined
  if (!lawyerProfile) return null;

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      {/* Hero */}
      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <img
                // In here, if the lawyer profile image is null, use an avatar image using @lib/avatar Helpers with lawyer first and last name
                src={lawyerProfile.profile.profileImage}
                alt={
                  lawyerProfile.profile.firstName +
                  " " +
                  lawyerProfile.profile.lastName
                }
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
              />
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center border-2 border-primary">
                <CheckCircle className="w-4 h-4 text-secondary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {lawyerProfile.profile.practiceAreas.map((s, i) => (
                  <Badge
                    key={i}
                    className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {lawyerProfile.profile.firstName}{" "}
                {lawyerProfile.profile.lastName}
              </h1>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                {lawyerProfile.profile.bio}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4">
                {[
                  {
                    value:
                      lawyerProfile.profile.stats.numOfAppointmentsCompleted,
                    label: "جلسة مكتملة",
                  },
                  {
                    value: lawyerProfile.profile.stats.yearsOfExperience,
                    label: "سنة خبرة",
                  },
                  {
                    value: lawyerProfile.profile.stats.articlesPublishedCount,
                    label: "مقال منشور",
                  },
                  {
                    value: `${lawyerProfile.profile.stats.clientRatingAverage} ★`,
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
                      {lawyerProfile.profile.summary}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخبرات العملية
                    </h2>
                    <div className="relative">
                      <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-border" />
                      <div className="space-y-8">
                        {lawyerProfile.workHistory.map((work, i) => (
                          <div key={i} className="relative pr-8">
                            <div className="absolute right-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                            <div className="text-xs text-secondary font-semibold mb-1">
                              {work.startYear} -{" "}
                              {work.isCurrentJob ? "الحالي" : work.endYear}
                            </div>
                            <h3 className="font-bold text-foreground">
                              {work.jobTitle}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {work.organizationName}
                            </p>
                            <p className="text-sm text-muted-foreground/80">
                              {work.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown and Featured Reviews */}
                  <div className="pt-12 border-t mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Rating Breakdown */}
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
                          رضا العملاء
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-5xl font-bold text-foreground">
                            {lawyerProfile.profile.stats.clientRatingAverage}
                          </span>
                          <div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-5 h-5 ${s <= Math.round(lawyerProfile.profile.stats.clientRatingAverage) ? "fill-secondary text-secondary" : "text-muted-foreground/30"}`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 uppercase">
                              بناءً على{" "}
                              {lawyerProfile.profile.stats.reviewsTotal} تقييم
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Featured Reviews */}
                      {lawyerProfile.topReviews.length > 0 && (
                        <div className="space-y-4">
                          {lawyerProfile.topReviews.map((review, i) => (
                            <Card key={i} className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={review.client.profileImageUrl}
                                    alt={`${review.client.firstName} ${review.client.lastName}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <h4 className="font-bold text-sm">
                                      {review.client.firstName}{" "}
                                      {review.client.lastName}
                                    </h4>
                                  </div>
                                </div>
                                <span className="text-[11px] text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString(
                                    "ar-EG",
                                  )}
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
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {/* In here, you put the fetched lawyer education and certifications */}
              {activeTab === "education" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخلفية الأكاديمية
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lawyerProfile.education.map((edu, i) => (
                        <Card
                          key={i}
                          className="p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="text-3xl mb-4">
                            {/* In here for bachelor's use an icon and for master's use an icon */}
                          </div>
                          <h3 className="font-bold text-lg text-foreground">
                            {edu.degreeType}
                          </h3>
                          <p className="text-secondary font-semibold text-sm">
                            {edu.fieldOfStudy}
                          </p>
                          <div className="mt-4 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {edu.universityName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.graduationYear}
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
                      {lawyerProfile.certifications.map((cert, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 bg-background rounded-lg border"
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">
                              {cert.certificateName}
                            </h3>
                            <p className="text-sm text-secondary">
                              {cert.issuingOrganization}
                            </p>
                            {/* Insert a place for yearObtained */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div className="mt-2">
                  <ReviewsTab lawyerId={id ?? ""} reportButton={false} />
                </div>
              )}
            </motion.div>
          </div>

          {/* Booking sidebar */}
          {/* In here just include the price for phone and office. Later, I will connect endpoints for it */}
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
                        ${lawyerProfile.pricing.phonePrice}
                      </p>
                      <p className="text-[11px] text-muted-foreground">/ساعة</p>
                    </div>
                    <div className="rounded-lg border p-3 bg-muted/20">
                      <p className="text-xs text-muted-foreground">مكتبية</p>
                      <p className="text-lg font-bold text-foreground">
                        ${lawyerProfile.pricing.officePrice}
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
                                ${lawyerProfile?.pricing.phonePrice} / ساعة
                              </p>
                            </div>
                            <input
                              type="radio"
                              name="sessionType"
                              checked={selectedSessionType === "phone"}
                              onChange={() => setSelectedSessionType("phone")}
                            />
                          </label>
                          <label className="flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer">
                            <div>
                              <p className="text-sm font-medium">مكتبية</p>
                              <p className="text-[11px] text-muted-foreground">
                                ${lawyerProfile.pricing.officePrice} / ساعة
                              </p>
                            </div>
                            <input
                              type="radio"
                              name="sessionType"
                              checked={selectedSessionType === "office"}
                              onChange={() => setSelectedSessionType("office")}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
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
                    // I will fix this later to connect it to the booking flow. Not now
                  >
                    <CalendarIcon className="w-5 h-5 ml-2" /> احجز جلسة
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold h-12 text-base"
                    // I will fix this later to connect it to the messaging flow. Not now
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
        </div>
      </div>

      {/* ── Send Message Modal [I will add those modal later] ── */}
      {/* <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
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
      </Dialog> */}

      <BlueFooter />
    </div>
  );
};

export default LawyerProfile;
