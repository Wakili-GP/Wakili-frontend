import { useState } from "react";
import {
  Search,
  Scale,
  Briefcase,
  Users,
  Star,
  Shield,
  ChevronLeft,
  Quote,
  Check,
  Sparkles,
  GraduationCap,
  Gavel,
  Building,
  Heart,
  FileText,
  Globe,
  UserCheck,
  Award,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import HeroVideo from "../assets/lawyer-search/Hero Video.mp4";
import Step1Video from "../assets/lawyer-search/Video Step 1.mp4";
import Step2Video from "../assets/lawyer-search/Video Step 2.mp4";
import Step3Video from "../assets/lawyer-search/Video Step 3.mp4";
import {
  featuredLawyers,
  testimonials,
  specializations,
} from "../data/lawyer-search";

const LawyerSearchPage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StepsSection />
      <CategoriesSection />
      <FeaturedLawyers />
      <TestimonialsSection />
      <StatsSection />
      <PricingSection />
      <CtaSection />
    </div>
  );
};

type UserIntent = "hire" | "work" | null;

const heroContent = {
  default: {
    headline: "وظّف الخبراء الذين يحتاجهم عملك",
    subtitle:
      "منصة وكيلك تربطك بأفضل المحامين المتخصصين في جميع المجالات القانونية",
  },
  hire: {
    headline: "ابحث عن محاميك المثالي",
    subtitle: "تصفح مئات المحامين المعتمدين واختر الأنسب لقضيتك بكل سهولة",
  },
  work: {
    headline: "انضم كمحامي إلى منصة وكيلك",
    subtitle: "وسّع قاعدة عملائك وانضم إلى شبكة محامين موثوقة ومتنامية",
  },
};

const HeroSection = () => {
  const [userIntent, setUserIntent] = useState<UserIntent>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const currentContent = userIntent
    ? heroContent[userIntent]
    : heroContent.default;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (userIntent) params.set("intent", userIntent);
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      <div className="relative min-h-[60vh] md:min-h-[75vh] flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={HeroVideo}
        />

        <div className="absolute inset-0 bg-linear-to-b from-blue-950/80 via-blue-900/65 to-blue-950/85" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 py-16 md:py-24 max-w-5xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={userIntent || "default"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                {currentContent.headline}
              </h1>
              <p className="text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
                {currentContent.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Intent Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button
              size="lg"
              variant={userIntent === "hire" ? "hero" : "outline"}
              className={`text-lg px-8 ${userIntent === "hire" ? "" : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"}`}
              onClick={() =>
                setUserIntent(userIntent === "hire" ? null : "hire")
              }
            >
              <Briefcase className="w-5 h-5 ml-2" />
              أريد توظيف
            </Button>
            <Button
              size="lg"
              variant={userIntent === "work" ? "cta" : "outline"}
              className={`text-lg px-8 ${userIntent === "work" ? "" : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"}`}
              onClick={() =>
                setUserIntent(userIntent === "work" ? null : "work")
              }
            >
              <GraduationCap className="w-5 h-5 ml-2" />
              أريد العمل
            </Button>
          </motion.div>

          {/* Search / CTA based on intent */}
          <AnimatePresence>
            {userIntent === "hire" && (
              <motion.form
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
                  <Search className="w-6 h-6 text-muted-foreground mr-3" />
                  <Input
                    type="text"
                    placeholder="ابحث بالاسم أو التخصص..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 text-lg focus-visible:ring-0 bg-transparent"
                  />
                  <Button type="submit" size="lg">
                    ابدأ البحث
                  </Button>
                </div>
              </motion.form>
            )}
            {userIntent === "work" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Button
                  size="lg"
                  variant="cta"
                  className="text-lg px-10"
                  onClick={() => navigate("/verify/lawyer")}
                >
                  سجّل كمحامي الآن
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 text-blue-100/70 text-sm flex-wrap"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>+500 محامي</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              <span>تقييم 4.8+</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>محامون معتمدون</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>جميع التخصصات</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
      </div>
    </div>
  );
};

const steps = [
  {
    number: 1,
    title: "اطرح قضيتك",
    description: "صف قضيتك القانونية واحتياجاتك بشكل مبسط لنفهم متطلباتك بدقة",
    video: Step1Video,
  },
  {
    number: 2,
    title: "اختر خبيرك",
    description: "تصفح قائمة المحامين المتخصصين وقارن بينهم لاختيار الأنسب لك",
    video: Step2Video,
  },
  {
    number: 3,
    title: "احصل على النتائج",
    description: "تواصل مع محاميك مباشرة، وابدأ في حل قضيتك بكل سرية واحترافية",
    video: Step3Video,
  },
];

const StepCard = ({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-20 lg:gap-32">
      {/* MOBILE STEP INDICATOR */}
      <div className="md:hidden flex flex-col items-center justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary text-primary flex items-center justify-center text-xl font-bold shadow-lg">
          {step.number}
        </div>
      </div>

      {/* DESKTOP CENTER DOT (Cuts out the line beautifully using ring) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-12 h-12 rounded-full bg-white border-[3px] border-primary text-primary flex items-center justify-center text-xl font-bold shadow-xl ring-8 ring-transparent transition-transform hover:scale-110 duration-300">
          {step.number}
        </div>
      </div>

      {/* TEXT CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className={`flex flex-col items-center text-center md:items-start md:text-start space-y-4 order-2 ${
          isEven ? "md:order-1" : "md:order-2"
        }`}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>الخطوة {step.number}</span>
        </div>

        <h3 className="text-3xl font-bold text-foreground">{step.title}</h3>

        <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
          {step.description}
        </p>
      </motion.div>

      {/* VIDEO CONTENT */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className={`order-1 ${isEven ? "md:order-2" : "md:order-1"}`}
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
          {/* Subtle overlay effect that vanishes on hover */}
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
          <video
            src={step.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-video object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
        </div>
      </motion.div>
    </div>
  );
};

const StepsSection = () => {
  return (
    <section className="py-28 px-4 bg-background relative overflow-hidden">
      {/* Background glow for elegance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-20">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <Badge variant="secondary" className="px-5 py-1.5 text-sm">
            دليلك المختصر
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            طريقك للعدالة في <span className="text-primary">3 خطوات</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            قمنا بتبسيط العملية لتوفير وقتك وجهدك. من وصف قضيتك إلى توظيف
            المحامي المناسب في دقائق معدودة.
          </p>
        </motion.div>

        {/* TIMELINE WRAPPER */}
        <div className="relative mt-16">
          {/* BEAUTIFUL FADING DESKTOP CENTER LINE */}
          <div className="hidden md:block absolute left-1/2 top-[5%] bottom-[5%] w-[2px] bg-gradient-to-b from-transparent via-primary/50 to-transparent -translate-x-1/2 rounded-full" />

          {/* STEPS LIST */}
          <div className="space-y-20 md:space-y-32">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const specIcons = {
  10: Scale,
  9: Sparkles,
  8: Building,
  7: Gavel,
  6: Briefcase,
  5: TrendingUp,
  4: Users,
  3: Heart,
};

const fallbackIcons = [
  Briefcase,
  Gavel,
  Scale,
  Heart,
  Building,
  Globe,
  FileText,
  UserCheck,
  Award,
  Shield,
  Users,
  Star,
];

const fallbackCounts = [48, 35, 42, 31, 27, 19, 38, 22, 45, 29, 33, 17];

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <Badge variant="secondary" className="text-sm px-4 py-1">
            التخصصات القانونية
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            اختر مجال تخصصك
          </h2>
          <p className="text-muted-foreground text-lg">
            تصفح المحامين حسب التخصص القانوني
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
          {specializations.map((spec, index) => {
            const name = spec.name || "تخصص قانوني";
            const description = spec.description || "استشارات قانونية متخصصة.";
            const Icon =
              specIcons[spec.id as keyof typeof specIcons] ??
              fallbackIcons[index % fallbackIcons.length];
            const count = fallbackCounts[index % fallbackCounts.length];

            return (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() =>
                  navigate(`/lawyers?specialty=${encodeURIComponent(name)}`)
                }
                className="group cursor-pointer relative"
              >
                <div className="absolute inset-0 rounded-3xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500" />

                <Card className="relative h-[250px] sm:h-[260px] rounded-3xl border border-border/50 bg-card/80 backdrop-blur-md shadow-sm group-hover:shadow-2xl group-hover:border-primary/30 transition-all duration-500 overflow-hidden">
                  <CardContent className="p-7 h-full flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition text-xs">
                        عرض →
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.75rem] leading-5">
                      {name}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-9 opacity-80 group-hover:opacity-100 transition">
                      {description}
                    </p>

                    <div className="flex items-center justify-between pt-2 mt-auto">
                      <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                        {count}+ محامي
                      </span>

                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                        <ChevronLeft className="w-3 h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { icon: Users, value: "+500", label: "محامي معتمد" },
    { icon: Star, value: "4.8+", label: "متوسط التقييم" },
    { icon: Award, value: "+1000", label: "استشارة ناجحة" },
    { icon: TrendingUp, value: "98%", label: "نسبة الرضا" },
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* soft background glow */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header mini trust line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-2"
        >
          <p className="text-sm text-muted-foreground tracking-wide">
            ثقة المستخدمين هي أساسنا
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            أرقام تتحدث عن نفسها
          </h3>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <div className="relative rounded-2xl p-px bg-linear-to-br from-border/60 via-border/30 to-transparent">
                <div className="rounded-2xl bg-card/80 backdrop-blur-md p-6 text-center space-y-3 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  {/* ICON */}
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* VALUE */}
                  <p className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                    {stat.value}
                  </p>

                  {/* LABEL */}
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* subtle bottom trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 flex items-center justify-center gap-6 text-xs text-muted-foreground flex-wrap"
        >
          <span>✔ محامون موثوقون</span>
          <span className="hidden md:block">•</span>
          <span>✔ بدون رسوم خفية</span>
          <span className="hidden md:block">•</span>
          <span>✔ استجابة فورية</span>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedLawyers = () => {
  const navigate = useNavigate();

  // fallback to your static data if props not provided
  const lawyers = featuredLawyers ?? [];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />

      <div className="relative max-w-6xl mx-auto space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            نخبة المحامين
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            اختر من بين أفضل المحامين الأعلى تقييماً والأكثر خبرة
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.slice(0, 6).map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-md shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl h-full flex flex-col">
                {/* header strip */}
                <div className="h-20 bg-linear-to-r from-primary/80 via-primary to-primary" />

                <CardContent className="p-5 pt-0 -mt-10 flex flex-col flex-1 gap-4">
                  {/* avatar */}
                  <div className="relative w-20 h-20">
                    <img
                      src={lawyer.image}
                      alt={lawyer.name}
                      className="w-20 h-20 rounded-2xl object-cover border shadow-md bg-background"
                    />
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background" />
                  </div>

                  {/* name */}
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition">
                      {lawyer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {lawyer.specialty}
                    </p>
                  </div>

                  {/* stats */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      {lawyer.rating}
                    </span>
                    <span>•</span>
                    <span>{lawyer.yearsExperience} سنة خبرة</span>
                    <span>•</span>
                    <span>{lawyer.reviewCount} تقييم</span>
                  </div>

                  {/* push buttons down */}
                  <div className="mt-auto flex gap-2 pt-3">
                    <Button
                      variant="hero"
                      onClick={() => navigate(`/lawyers/${lawyer.id}`)}
                      className="flex-1"
                    >
                      الملف الشخصي
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => navigate(`/hire/${lawyer.id}`)}
                      className="flex-1"
                    >
                      توظيف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* VIEW MORE */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate("/lawyers")}
            className="cursor-pointer text-lg text-muted-foreground hover:text-primary transition"
          >
            عرض جميع المحامين →
          </button>
        </div>
      </div>
    </section>
  );
};

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-elegant transition-all duration-500 hover:-translate-y-1">
        <CardContent className="p-6 space-y-4">
          <Quote className="w-8 h-8 text-secondary/40" />
          <p className="text-foreground leading-relaxed text-base">
            {testimonial.quote}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-foreground text-sm">
                {testimonial.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
            <Badge variant="outline" className="mr-auto text-xs">
              {testimonial.caseType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <Badge variant="secondary" className="text-sm px-4 py-1">
            آراء العملاء
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            قصص نجاح حقيقية
          </h2>
          <p className="text-muted-foreground text-lg">
            ماذا يقول عملاؤنا عن تجربتهم مع وكيلك
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const pricingFeatures = [
  "البحث عن محامين بدون حدود",
  "مقارنة الأسعار والتقييمات",
  "التواصل المباشر مع المحامين",
  "حجز استشارات فورية",
  "مراجعة تقييمات العملاء السابقين",
  "دعم فني على مدار الساعة",
  "ضمان جودة الخدمة",
  "بدون عمولة أو رسوم خفية",
];
const PricingSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <Badge variant="secondary" className="text-sm px-4 py-1">
            الأسعار
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            مجاني بالكامل
          </h2>
          <p className="text-muted-foreground text-lg">
            لا نأخذ أي عمولة — أنت تدفع فقط أتعاب المحامي
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden border-2 border-secondary/30 bg-card shadow-elegant">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-l from-secondary via-secondary/80 to-primary" />
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold text-primary">
                        $0
                      </span>
                      <span className="text-muted-foreground text-lg">
                        / للأبد
                      </span>
                    </div>
                    <p className="text-xl text-foreground font-semibold">
                      بدون رسوم — بدون عمولة — بدون رسوم خفية
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pricingFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-secondary" />
                  </div>
                  <Button
                    size="xl"
                    variant="hero"
                    className="px-10"
                    onClick={() => navigate("/lawyers")}
                  >
                    ابدأ الآن مجاناً
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative overflow-hidden"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      {/* Rich blue gradient background */}
      <div className="relative bg-linear-to-bl from-blue-900 via-blue-800 to-blue-950 py-24 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Icon accent */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-2">
                <Scale className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              ابدأ البحث عن محاميك الآن
            </h2>
            <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto">
              انضم إلى آلاف المستخدمين الذين وجدوا المحامي المناسب لقضاياهم عبر
              منصة وكيلك.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 text-lg bg-white text-blue-900 hover:bg-gray-100"
              onClick={() => navigate("/lawyers")}
            >
              تصفح المحامين
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-10 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              onClick={() => navigate("/verify/lawyer")}
            >
              سجل كمحامي
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LawyerSearchPage;
