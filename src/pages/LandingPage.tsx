import { useEffect } from "react";
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
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              أهم محامينا
            </a>
            <a
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              ماذا يقول عملاؤنا عنا
            </a>
            <a
              href="#services"
              className="text-foreground hover:text-primary transition-colors"
            >
              المميزات
            </a>
            <a
              href="#services"
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
              منصة كلاينت نيكسوس - الحل الرقمي المبتكر للربط بين العملاء ومقدمي
              الخدمات القانونية. من الاستشارة إلى الدعم المستمر
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
export default LandingPage;
