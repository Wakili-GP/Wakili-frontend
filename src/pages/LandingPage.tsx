import { useEffect } from "react";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            <Scale className="h-9 w-9 text-primary" />
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
              className="text-foreground hover:text-primary transition-colors"
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
export default LandingPage;
