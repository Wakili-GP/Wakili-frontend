import { useEffect, FC } from "react";
import {
  Scale,
  Users,
  MessageCircle,
  Apple,
  Smartphone,
  Shield,
  Zap,
  Clock,
  BookOpen,
  Video,
  Award,
  Briefcase,
  Star,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import legalHeroImage from "../assets/legal-hero.jpg";
import { motion } from "framer-motion";
import mobileMockup from "../assets/floating-iphones.png";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Marquee from "react-fast-marquee";
import lawyer_1 from "../assets/lawyer-1.jpg";
import lawyer_2 from "../assets/lawyer-2.png";
import lawyer_3 from "../assets/lawyer-3.png";
const LandingPage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  });
  return (
    <div className="min-h-screen bg-background font-cairo" dir="rtl">
      <Navigation />
      <Hero />
      <MobileApp />
      <Services />
      <Lawyers />
      <Testimonials />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};
const Navigation = () => {
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border fixed top-0 w-full z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Scale className="h-12 w-9 text-primary" />
            <span className="text-2xl font-bold text-foreground">وكيلي</span>
          </div>
          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              الخدمات
            </a>
            <a
              href="#lawyers"
              className="text-foreground hover:text-primary transition-colors"
            >
              أهم محامينا
            </a>
            <a
              href="#testimonials"
              className="text-foreground hover:text-primary transition-colors"
            >
              ماذا يقول عملاؤنا عنا
            </a>
            <a
              href="#features"
              className="text-foreground hover:text-primary transition-colors"
            >
              المميزات
            </a>
            <a
              href="#"
              className="text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              من نحن
            </a>
            <Button variant="hero" size="lg">
              ابدأ الآن
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${legalHeroImage})` }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-18">
              أول منصة قانونية شاملة في مصر
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              منصة وكيلي - الحل الرقمي المبتكر للربط بين العملاء ومقدمي الخدمات
              القانونية. من الاستشارة إلى الدعم المستمر
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* First Button */}
              <Button
                variant="cta"
                size="xl"
                className="shadow-glow cursor-pointer"
              >
                <Users className="ml-2" />
                احجز استشارة قانونية
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="cursor-pointer border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <MessageCircle className="ml-2" />
                تحدث مع الذكاء الاصطناعي
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src={legalHeroImage}
              alt="منصة وكيلي القانونية"
              className="w-full h-auto rounded-lg shadow-elegant"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
const MobileApp = () => {
  return (
    <section className="relative py-12 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-right space-y-4"
          >
            <div className="inline-block px-3 py-1.5 bg-primary/10 rounded-full mb-2">
              <span className="text-primary font-semibold text-sm">
                متوفر الآن
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              الآن حمّل تطبيق الموبايل
            </h2>

            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              احمل وكيلك القانوني معك أينما كنت. احصل على استشارات فورية، تابع
              قضاياك، وتواصل مع محاميك المفضل بضغطة زر واحدة.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="group relative px-6 py-3 bg-foreground text-background rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <Apple className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-[10px] opacity-80">حمّل من</div>
                  <div className="text-sm">App Store</div>
                </div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="group relative px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <Smartphone className="w-5 h-5" />
                <div className="text-right">
                  <div className="text-[10px] opacity-90">حمّل من</div>
                  <div className="text-sm">Google Play</div>
                </div>
              </motion.a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-xs text-muted-foreground">تحميل</div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-xs text-muted-foreground">التقييم</div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">دعم</div>
              </div>
            </div>
          </motion.div>

          {/* Left Side - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-3xl" />

              {/* Phone Mockup */}
              <div className="relative z-10">
                <motion.img
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  src={mobileMockup}
                  alt="وكيلك على الموبايل"
                  className="w-full h-96 max-w-[450px] mx-auto drop-shadow-2xl"
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-8 -right-8 bg-card p-3 rounded-xl shadow-lg border border-border"
              >
                <Shield className="w-6 h-6 text-primary" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-16 -left-8 bg-card p-3 rounded-xl shadow-lg border border-border"
              >
                <Zap className="w-6 h-6 text-accent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            خدماتنا القانونية الشاملة
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نقدم حلولاً قانونية متكاملة تلبي جميع احتياجاتك من الاستشارة الفورية
            إلى الدعم طويل المدى
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  حجز المواعيد السهل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  احجز استشارتك القانونية في المكتب أو عبر الهاتف أو الإنترنت
                  بكل سهولة ومرونة
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  دعم الطوارئ الفوري
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  خدمة دعم قانوني فوري في الحالات العاجلة والطارئة على مدار
                  الساعة
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-success-green/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-success-green" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  الذكي الاصطناعي القانوني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  مساعد ذكي يجيب على استفساراتك القانونية بناءً على القانون
                  المصري مع إمكانية التوجيه للمحامين
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-warning-amber/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-warning-amber" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  منتدى الأسئلة والأجوبة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  مجتمع تفاعلي لطرح الأسئلة القانونية والحصول على إجابات من
                  خبراء قانونيين
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  الاستشارات عبر الإنترنت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  استشارات قانونية مرئية عالية الجودة من راحة منزلك باستخدام
                  تقنية Zoom
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  تطبيق الهاتف المحمول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base leading-relaxed">
                  تطبيق محمول متطور يتيح لك الوصول لجميع الخدمات من هاتفك بسهولة
                  تامة
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
interface LawyerCardProps {
  lawyerImg: string;
  lawyerName: string;
  lawyerCases: number | string;
  lawyerSpecialization: string;
  lawyerRating: number | string;
  lawyerExperience: string;
}
const LawyerCard: FC<LawyerCardProps> = ({
  lawyerImg,
  lawyerName,
  lawyerCases,
  lawyerSpecialization,
  lawyerRating,
  lawyerExperience,
}) => {
  const ratingValue = Number(lawyerRating);

  return (
    <Card className="min-w-[320px] mx-4 bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
      <CardContent>
        {/* Avatar + Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={lawyerImg}
              alt={lawyerName}
              className="w-16 h-16 rounded-full object-cover shadow-card"
            />
            <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-1">
              <Award className="w-3 h-3 text-secondary-foreground" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">
              {lawyerName}
            </h3>
            <p className="text-sm text-muted-foreground">{lawyerExperience}</p>
          </div>
        </div>

        {/* Specialization + Stats */}
        <div className="mb-3">
          <p className="text-sm font-medium text-primary mb-2">
            {lawyerSpecialization}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 ml-1" />
              <span>{lawyerCases} قضية</span>
            </div>

            <div className="flex items-center">
              <Star className="w-4 h-4 ml-1 text-warning-amber fill-current" />
              <span className="font-medium">{lawyerRating}</span>
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex justify-between items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(ratingValue)
                    ? "text-warning-amber fill-current"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            متاح للاستشارة
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const Lawyers: FC = () => {
  return (
    <section id="lawyers" className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          أهم محامينا
        </h2>
        <p className="text-xl text-muted-foreground">
          نخبة من أفضل المحامين المتخصصين في مختلف فروع القانون
        </p>
      </div>

      <div className="container relative">
        {/* Fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none"></div>

        <Marquee gradient={false} speed={50} pauseOnHover autoFill={true}>
          <LawyerCard
            lawyerImg={lawyer_1}
            lawyerName="د. أحمد المحامي"
            lawyerCases={350}
            lawyerSpecialization="القانون الجنائي والمدني"
            lawyerRating={4.9}
            lawyerExperience="15 سنة خبرة"
          />
          <LawyerCard
            lawyerImg={lawyer_2}
            lawyerName="د. فاطمة علي"
            lawyerCases={280}
            lawyerSpecialization="قانون الأسرة والأحوال الشخصية"
            lawyerRating={4.8}
            lawyerExperience="12 سنة خبرة"
          />
          <LawyerCard
            lawyerImg={lawyer_3}
            lawyerName="د. محمد حسن"
            lawyerCases={420}
            lawyerSpecialization="القانون التجاري والشركات"
            lawyerRating={4.9}
            lawyerExperience="20 سنة خبرة"
          />
          <LawyerCard
            lawyerImg={lawyer_2}
            lawyerName="د. سارة أحمد"
            lawyerCases={195}
            lawyerSpecialization="قانون العقارات والاستثمار"
            lawyerRating={4.7}
            lawyerExperience="8 سنوات خبرة"
          />
          <LawyerCard
            lawyerImg={lawyer_1}
            lawyerName="د. خالد محمود"
            lawyerCases={310}
            lawyerSpecialization="القانون الدولي والتحكيم"
            lawyerRating={4.8}
            lawyerExperience="18 سنة خبرة"
          />
          <LawyerCard
            lawyerImg={lawyer_3}
            lawyerName="د. نور الدين"
            lawyerCases={240}
            lawyerSpecialization="قانون العمل والضمان الاجتماعي"
            lawyerRating={4.6}
            lawyerExperience="10 سنوات خبرة"
          />
        </Marquee>
      </div>
    </section>
  );
};
const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            ماذا يقول عملاؤنا عنا
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف تجارب عملائنا وآرائهم حول الخدمات القانونية التي نقدمها
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          true
                            ? "text-warning-amber fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "خدمة ممتازة ومحامون محترفون. حلوا مشكلتي القانونية بسرعة
                  وكفاءة عالية. أنصح بشدة بهذه المنصة."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center ml-3">
                    <span className="text-primary font-semibold">أ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">أحمد محمد</h4>
                    <p className="text-sm text-muted-foreground">رجل أعمال</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          true
                            ? "text-warning-amber fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "المنصة سهلة الاستخدام والذكي الاصطناعي مفيد جداً. وفرت علي
                  الكثير من الوقت والجهد في البحث عن المعلومات القانونية."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center ml-3">
                    <span className="text-secondary font-semibold">س</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">سارة أحمد</h4>
                    <p className="text-sm text-muted-foreground">محاسبة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          true
                            ? "text-warning-amber fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "تجربة رائعة مع فريق محترف. الاستشارة كانت مفصلة ومفيدة،
                  والمحامي كان صبوراً في الشرح والتوضيح."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-success-green/10 rounded-full flex items-center justify-center ml-3">
                    <span className="text-success-green font-semibold">م</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">محمد علي</h4>
                    <p className="text-sm text-muted-foreground">مهندس</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          true
                            ? "text-warning-amber fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "خدمة جيدة وسعر مناسب. كان هناك تأخير بسيط في الرد ولكن بشكل
                  عام التجربة إيجابية وأنصح بها."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-warning-amber/10 rounded-full flex items-center justify-center ml-3">
                    <span className="text-warning-amber font-semibold">ف</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">فاطمة حسن</h4>
                    <p className="text-sm text-muted-foreground">طبيبة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          true
                            ? "text-warning-amber fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "استثنائي! المحامي كان خبيراً في مجاله وقدم نصائح قيمة جداً.
                  المنصة آمنة وموثوقة بنسبة 100%."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center ml-3">
                    <span className="text-primary font-semibold">ك</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">كريم يوسف</h4>
                    <p className="text-sm text-muted-foreground">صاحب شركة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gradient-card border-0 shadow-card hover:shadow-elegant transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-warning-amber">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          true
                            ? "text-warning-amber fill-current"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "منصة مبتكرة ومفيدة جداً. الذكي الاصطناعي أجاب على كل
                  استفساراتي بدقة، وعندما احتجت استشارة شخصية كان الحجز سهل."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center ml-3">
                    <span className="text-secondary font-semibold">ن</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      نورا إبراهيم
                    </h4>
                    <p className="text-sm text-muted-foreground">مصممة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            التقنيات المتقدمة التي نستخدمها
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نعتمد على أحدث التقنيات لضمان أفضل تجربة قانونية رقمية في مصر
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="gap-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ذكاء اصطناعي متطور
                </h3>
                <p className="text-muted-foreground">
                  نستخدم تقنيات GPT-4o مع نموذج RAG للإجابة على الاستفسارات
                  القانونية بدقة عالية
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  أمان وموثوقية
                </h3>
                <p className="text-muted-foreground">
                  بنية تحتية آمنة مع تشفير البيانات وحماية الخصوصية باستخدام
                  ASP.NET Core
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 mb-4">
              <div className="w-10 h-10 bg-success-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-success-green" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  تجربة مستخدم متميزة
                </h3>
                <p className="text-muted-foreground">
                  واجهات سهلة الاستخدام مع دعم كامل للغة العربية وتجربة محمولة
                  متطورة
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-warning-amber/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="h-5 w-5 text-warning-amber" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  قاعدة بيانات قانونية شاملة
                </h3>
                <p className="text-muted-foreground">
                  مجموعة واسعة من القوانين والتشريعات المصرية مع تحديثات مستمرة
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card rounded-2xl p-8 shadow-elegant">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              إحصائيات المنصة
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  1000+
                </div>
                <div className="text-muted-foreground">محامي معتمد</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  5000+
                </div>
                <div className="text-muted-foreground">استشارة مكتملة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-green mb-2">
                  24/7
                </div>
                <div className="text-muted-foreground">دعم مستمر</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-amber mb-2">
                  99%
                </div>
                <div className="text-muted-foreground">رضا العملاء</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/90" />
      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
          ابدأ رحلتك القانونية معنا اليوم
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-8">
          انضم إلى آلاف العملاء الذين يثقون في منصة وكيلي للحصول على أفضل
          الخدمات القانونية
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cta" size="xl" className="shadow-glow">
            <Phone className="ml-2" />
            احجز استشارة مجانية
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <MessageCircle className="ml-2" />
            تجربة الذكي الاصطناعي
          </Button>
        </div>
      </div>
    </section>
  );
};
const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold">منصة وكيلي</span>
            </div>
            <p className="text-background/80 mb-4">
              أول منصة قانونية شاملة في مصر تقدم حلولاً رقمية متطورة لربط
              العملاء بالخدمات القانونية
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <a
                  href="#services"
                  className="hover:text-secondary transition-colors"
                >
                  الخدمات
                </a>
              </li>
              <li>
                <a
                  href="#lawyers"
                  className="hover:text-secondary transition-colors"
                >
                  أهم محامينا
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-secondary transition-colors"
                >
                  آراء العملاء
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-secondary transition-colors"
                >
                  المميزات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  من نحن
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <div className="space-y-2 text-background/80">
              <p>القاهرة، مصر</p>
              <p>+20 11 4495 8064</p>
              <p>info@wakiliy.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
          <p>
            &copy; {new Date().getFullYear()} منصة وكيلي . جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default LandingPage;
