import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  MessageCircle,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { arSA } from "date-fns/locale";
import MainNavbar from "@/components/MainNavbar";

const lawyerData = {
  name: "د. أحمد سليمان",
  title: "شريك أول في مكتب سليمان وشركاه",
  tagline: "متخصص في القضايا التجارية الكبرى والتحكيم الدولي والحوكمة البحرية.",
  specialties: ["القانون التجاري", "التحكيم"],
  profileImage:
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop",
  verified: true,
  stats: {
    casesHandled: "1,240+",
    yearsExperience: "18",
    articlesPublished: "45",
    clientRating: "4.9",
  },
  sessionPrice: 450,
  sessionType: "مكتبي / هاتفي",
  about:
    "د. أحمد سليمان محامٍ متميز يمتلك ما يقرب من عقدين من الخبرة في التعامل مع تعقيدات القانون التجاري الدولي. معروف بنهجه الدقيق في استراتيجية القضايا والتزامه الراسخ بالدفاع عن حقوق العملاء، وقد نجح في تمثيل شركات ضمن قائمة Fortune 500 في نزاعات عابرة للحدود رفيعة المستوى. يركز في ممارسته على تقاطع اللوائح البحرية واتفاقيات التجارة العالمية، مقدماً استشارات استراتيجية توازن بين الدقة القانونية والبراغماتية التجارية.",
  workHistory: [
    {
      title: "شريك أول",
      company: "مكتب سليمان وشركاه، دبي",
      period: "2012 — حتى الآن",
      description:
        "قيادة قسم التحكيم الدولي والإشراف على فريق من 45 محامياً عبر ثلاثة مكاتب إقليمية.",
    },
    {
      title: "محامي أول",
      company: "شركاء القانون الدوليون، لندن",
      period: "2008 — 2012",
      description:
        "التخصص في التقاضي البحري ومنازعات العقود ضمن إطار التجارة الأوروبية.",
    },
    {
      title: "محامي مبتدئ",
      company: "هيغنز وشركاه — القانون البحري",
      period: "2005 — 2008",
      description:
        "المساعدة في الإيداعات التنظيمية المعقدة واكتشاف المستندات لشركات الخدمات اللوجستية متعددة الجنسيات.",
    },
  ],
  education: [
    {
      degree: "ماجستير في القانون (LL.M.)",
      field: "حل النزاعات الدولية",
      university: "كينغز كوليج لندن",
      period: "2007 — 2008",
      icon: "🎓",
    },
    {
      degree: "بكالوريوس في القانون (LL.B.)",
      field: "مرتبة الشرف الأولى",
      university: "جامعة القاهرة",
      period: "2001 — 2005",
      icon: "📜",
    },
  ],
  certifications: [
    { name: "محترف تحكيم معتمد", issuer: "رابطة المحامين الدولية (IBA)" },
    { name: "زميل معهد المحكمين المعتمدين", issuer: "CIArb، فرع دبي" },
  ],
  reviews: {
    average: 4.9,
    total: 142,
    breakdown: { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 },
    items: [
      {
        name: "محمد أحمد",
        role: "المدير التنفيذي، شركة اللوجستيات",
        date: "24 أكتوبر 2023",
        rating: 5,
        comment:
          "قدم د. أحمد سليمان توجيهاً استثنائياً خلال إعادة هيكلة شركتنا. خبرته في قانون التجارة البحرية وفرت علينا أشهراً من التقاضي المحتمل. مستشار سيادي حقيقي.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
      {
        name: "سارة محمود",
        role: "مديرة هيئة الميناء",
        date: "12 سبتمبر 2023",
        rating: 5,
        comment:
          "دقيق وسريع الاستجابة. جعل الأطر التنظيمية المعقدة سهلة الفهم لمجلس إدارتنا.",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
    ],
  },
  recentActivity: [
    {
      time: "منذ يومين",
      title: "نشر مقال: تطور التحكيم البحري في دول الخليج",
      description:
        "نظرة عميقة حول كيف تعيد الإصلاحات القانونية الإقليمية تشكيل نزاعات التجارة الدولية في الشرق الأوسط...",
      icon: "article",
      color: "primary",
    },
    {
      time: "منذ أسبوع",
      title: "متحدث رئيسي في المنتدى القانوني العالمي في دبي",
      description:
        "تقديم عرض حول 'تقاطع الذكاء الاصطناعي والقانون البحري' أمام أكثر من 500 قائد صناعي وخبير قانوني.",
      icon: "event",
      color: "secondary",
    },
    {
      time: "منذ أسبوعين",
      title: "تسوية نزاع تجاري بقيمة 20 مليون دولار بنجاح",
      description:
        "تحقيق تسوية ودية خارج المحكمة لشريك لوجستي إقليمي كبير، مما يضمن استمرارية الأعمال.",
      icon: "success",
      color: "success",
    },
  ],
};

const LawyerProfile = () => {
  const [activeTab, setActiveTab] = useState("bio");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const weeklyAvailability: Record<number, string[]> = {
    0: ["09:00", "10:00", "11:00", "13:00", "15:00", "16:00"],
    1: ["09:00", "10:00", "12:00", "14:00", "16:00"],
    2: ["09:00", "10:30", "12:30", "14:30", "16:30"],
    3: ["09:00", "11:00", "13:00", "15:00", "16:00"],
    4: ["09:00", "10:00", "12:00", "14:00", "15:30"],
    5: [],
    6: [],
  };

  const availableTimes = selectedDate
    ? (weeklyAvailability[selectedDate.getDay()] ?? [])
    : [];

  const handleBookSession = () => {
    if (!selectedDate) {
      toast.error("يرجى اختيار تاريخ أولاً");
      return;
    }
    if (!selectedTime) {
      toast.error("يرجى اختيار وقت الجلسة");
      return;
    }
    if (availableTimes.length === 0) {
      toast.error("لا توجد مواعيد متاحة في هذا اليوم");
      return;
    }
    toast.success(
      `تم حجز جلسة بتاريخ ${selectedDate.toLocaleDateString("ar-EG")} الساعة ${selectedTime}`,
    );
  };

  const tabs = [
    { id: "bio", label: "السيرة والخبرات" },
    { id: "education", label: "التعليم" },
    { id: "reviews", label: "التقييمات" },
    { id: "activity", label: "آخر النشاطات" },
  ];

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case "article":
        return <FileText className="w-5 h-5 text-primary" />;
      case "event":
        return <MessageCircle className="w-5 h-5 text-secondary" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <MainNavbar fixed />

      <section className="bg-primary pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative shrink-0">
              <img
                src={lawyerData.profileImage}
                alt={lawyerData.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-secondary/40 object-cover shadow-lg"
              />
              {lawyerData.verified && (
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center border-2 border-primary">
                  <CheckCircle className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {lawyerData.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                {lawyerData.name}
              </h1>
              <p className="text-primary-foreground/80 text-sm md:text-base mb-2">
                {lawyerData.title}
              </p>
              <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl">
                {lawyerData.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-6 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4">
                {[
                  {
                    value: lawyerData.stats.casesHandled,
                    label: "قضية تم التعامل معها",
                  },
                  {
                    value: lawyerData.stats.yearsExperience,
                    label: "سنة خبرة",
                  },
                  {
                    value: lawyerData.stats.articlesPublished,
                    label: "مقال منشور",
                  },
                  {
                    value: `${lawyerData.stats.clientRating} ★`,
                    label: "تقييم العملاء",
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center md:text-right">
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
            <div className="border-b border-border mb-8">
              <div className="flex gap-6 flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-medium transition-all relative cursor-pointer ${
                      activeTab === tab.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
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
              {activeTab === "bio" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      الملخص المهني
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                      {lawyerData.about}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخبرات العملية
                    </h2>
                    <div className="relative">
                      <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-border" />
                      <div className="space-y-8">
                        {lawyerData.workHistory.map((work, index) => (
                          <div key={index} className="relative pr-8">
                            <div className="absolute right-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
                            <div className="text-xs text-secondary font-semibold mb-1">
                              {work.period}
                            </div>
                            <h3 className="font-bold text-foreground">
                              {work.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              {work.company}
                            </p>
                            <p className="text-sm text-muted-foreground/80">
                              {work.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      الخلفية الأكاديمية
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lawyerData.education.map((edu, index) => (
                        <Card
                          key={index}
                          className="p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="text-3xl mb-4">{edu.icon}</div>
                          <h3 className="font-bold text-lg text-foreground">
                            {edu.degree}
                          </h3>
                          <p className="text-secondary font-semibold text-sm">
                            {edu.field}
                          </p>
                          <div className="mt-4 space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {edu.university}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.period}
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
                      {lawyerData.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-background rounded-lg border"
                        >
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <Award className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-secondary">
                              {cert.issuer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-foreground">
                          {lawyerData.reviews.average}
                        </div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(lawyerData.reviews.average)
                                  ? "fill-secondary text-secondary"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {lawyerData.reviews.average}/5 بناءً على
                          {` ${lawyerData.reviews.total} `}
                          تقييم
                        </p>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-4 text-muted-foreground">
                              {rating}
                            </span>
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full transition-all"
                                style={{
                                  width: `${lawyerData.reviews.breakdown[rating as keyof typeof lawyerData.reviews.breakdown]}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {
                                lawyerData.reviews.breakdown[
                                  rating as keyof typeof lawyerData.reviews.breakdown
                                ]
                              }
                              %
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-4">
                    {lawyerData.reviews.items.map((review, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={review.image}
                              alt={review.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="font-bold text-foreground">
                                {review.name}
                              </h4>
                              <p className="text-xs text-secondary tracking-wide">
                                {review.role}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-secondary text-secondary"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic text-[15px] leading-relaxed">
                          "{review.comment}"
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    آخر التحديثات
                  </h2>
                  <div className="space-y-6">
                    {lawyerData.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-6 border-b border-border last:border-b-0"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            activity.color === "primary"
                              ? "bg-primary/10"
                              : activity.color === "secondary"
                                ? "bg-secondary/10"
                                : "bg-emerald-500/10"
                          }`}
                        >
                          {getActivityIcon(activity.icon)}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-secondary font-semibold tracking-wide mb-1">
                            {activity.time}
                          </p>
                          <h3 className="font-bold text-foreground mb-1">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          <div className="lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Booking Card */}
              <Card className="p-6 shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    سعر الجلسة
                  </span>
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    <MapPin className="w-3 h-3 ml-1" />
                    {lawyerData.sessionType}
                  </Badge>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${lawyerData.sessionPrice}
                  </span>
                  <span className="text-muted-foreground text-sm">/ساعة</span>
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
                    locale={arSA}
                    dir="rtl"
                    className="rounded-lg border w-full"
                    classNames={{
                      day: "p-0",
                      day_button:
                        "h-9 w-9 cursor-pointer p-0 text-center leading-none font-medium text-sm rounded-full border border-transparent transition-colors inline-flex items-center justify-center hover:bg-muted aria-selected:border-secondary aria-selected:bg-secondary/10 aria-selected:text-foreground aria-selected:font-bold data-[selected-single=true]:border-secondary data-[selected-single=true]:bg-secondary/10 data-[selected-single=true]:text-foreground data-[selected-single=true]:font-bold data-[selected-single=true]:hover:bg-secondary/10",
                      outside:
                        "text-muted-foreground/55 opacity-100 aria-selected:text-muted-foreground/55",
                      today:
                        "bg-primary text-white rounded-full aria-selected:border-secondary",
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="mb-4">
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
                        لا توجد مواعيد متاحة في هذا اليوم. يرجى اختيار يوم آخر.
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary-hover font-semibold h-12 text-base"
                    onClick={handleBookSession}
                  >
                    <CalendarIcon className="w-5 h-5 ml-2" />
                    احجز جلسة
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold h-12 text-base"
                  >
                    <MessageSquare className="w-5 h-5 ml-2" />
                    تواصل عبر واتساب
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">
              رضا العملاء
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-foreground">
                {lawyerData.reviews.average}
              </span>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(lawyerData.reviews.average)
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  بناءً على {lawyerData.reviews.total} تقييم
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-4">{rating}</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{
                        width: `${lawyerData.reviews.breakdown[rating as keyof typeof lawyerData.reviews.breakdown]}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {
                      lawyerData.reviews.breakdown[
                        rating as keyof typeof lawyerData.reviews.breakdown
                      ]
                    }
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {lawyerData.reviews.items.map((review, index) => (
              <Card key={index} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm">{review.name}</h4>
                      <p className="text-[11px] text-secondary tracking-wide">
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? "fill-secondary text-secondary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{review.comment}"
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">وكيلك</h3>
              <p className="text-primary-foreground/70 text-sm">
                تقديم خبرة قانونية موثوقة عبر الحدود بنزاهة لا تتزعزع.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm tracking-wide">
                روابط سريعة
              </h4>
              <ul className="space-y-2 text-primary-foreground/70 text-sm">
                <li className="hover:text-secondary cursor-pointer transition-colors">
                  البحث عن محامي
                </li>
                <li className="hover:text-secondary cursor-pointer transition-colors">
                  المقالات القانونية
                </li>
                <li className="hover:text-secondary cursor-pointer transition-colors">
                  مراجعة العقود بالذكاء الاصطناعي
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm tracking-wide">
                قانوني
              </h4>
              <ul className="space-y-2 text-primary-foreground/70 text-sm">
                <li className="hover:text-secondary cursor-pointer transition-colors">
                  سياسة الخصوصية
                </li>
                <li className="hover:text-secondary cursor-pointer transition-colors">
                  شروط الخدمة
                </li>
                <li className="hover:text-secondary cursor-pointer transition-colors">
                  سياسة ملفات تعريف الارتباط
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm tracking-wide">
                اتصل بنا
              </h4>
              <div className="space-y-2 text-primary-foreground/70 text-sm">
                <p>القاهرة، مصر</p>
                <p>support@wakilak.com</p>
                <p>+20 123 456 7890</p>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-primary-foreground/20" />
          <p className="text-center text-primary-foreground/50 text-sm">
            &copy; 2024 وكيلك. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default LawyerProfile;
