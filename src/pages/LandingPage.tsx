import { useEffect } from "react";
import { Scale, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import legalHeroImage from "../assets/legal-hero.jpg";
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
export default LandingPage;
