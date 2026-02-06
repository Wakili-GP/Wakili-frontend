import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge";
import LawyerSearch from "../components/LawyerSearch.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  MessageCircle,
  Users,
  FileText,
  HelpCircle,
  BookOpen,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import Footer from "../components/Footer.tsx";
import ComingSoon from "../components/ComingSoon.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { toast } from "@/components/ui/sonner";
const HomePage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح", {
        description: "نراك قريباً",
      });
      navigate("/");
    } catch (error) {
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  const notifications = [
    {
      id: 1,
      title: "استشارة جديدة",
      message: "لديك استشارة قانونية جديدة",
      time: "منذ ساعة",
    },
    {
      id: 2,
      title: "تحديث الحالة",
      message: "تم تحديث حالة القضية",
      time: "منذ ساعتين",
    },
    {
      id: 3,
      title: "موعد قريب",
      message: "لديك موعد غدا في المحكمة",
      time: "منذ 3 ساعات",
    },
  ];
  const renderHomeContent = () => (
    <div className="space-y-20">
      <HeroSection />
    </div>
  );
  const renderSection = () => {
    switch (activeSection) {
      case "محامي":
        return <LawyerSearch />;

      case "حلل عقدا":
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                هل تريد تحليل عقدك؟
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                حلّل عقودك القانونية باستخدام الذكاء الاصطناعي لاكتشاف المخاطر،
                فهم البنود المعقّدة، والحصول على ملخص واضح ودقيق خلال ثوانٍ.
              </p>
            </div>

            <ComingSoon
              title="تحليل العقود بالذكاء الاصطناعي"
              description="نعمل حالياً على تطوير أداة متقدمة لتحليل العقود بدقة عالية"
              featureTitle="تحليل العقود تلقائياً"
              featureDescription="مراجعة وتحليل العقود واكتشاف الثغرات القانونية باستخدام الذكاء الاصطناعي"
              badgeText="قيد التطوير"
              progress={60}
            />
          </div>
        );

      case "اسئلة شائعة":
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                الأسئلة الشائعة
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                إجابات شاملة ودقيقة للأسئلة الأكثر شيوعاً في المجال القانوني
              </p>
            </div>

            <ComingSoon
              title="مركز الأسئلة الشائعة"
              description="نعمل على إعداد قاعدة معرفية قانونية شاملة"
              featureTitle="أسئلة وأجوبة قانونية"
              featureDescription="إجابات دقيقة ومدعومة من خبراء قانونيين"
              badgeText="قريباً"
              progress={40}
            />
          </div>
        );

      case "مقالات":
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                المقالات القانونية
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                مقالات قانونية متخصصة وتحليلات معمّقة
              </p>
            </div>

            <ComingSoon
              title="مكتبة المقالات القانونية"
              description="نعمل على إطلاق مكتبة مقالات قانونية عالية الجودة"
              featureTitle="مقالات وتحليلات قانونية"
              featureDescription="محتوى قانوني موثوق مكتوب من خبراء ومتخصصين"
              badgeText="قيد التحضير"
              progress={50}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "الرئيسية", icon: Scale },
                {
                  id: "الذكاء الاصطناعي",
                  label: "الذكاء الاصطناعي",
                  icon: MessageCircle,
                },
                { id: "محامي", label: "محامي", icon: Users },
                { id: "حلل عقدا", label: "حلل عقدا", icon: FileText },
                { id: "اسئلة شائعة", label: "اسئلة شائعة", icon: HelpCircle },
                { id: "مقالات", label: "مقالات", icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`cursor-pointer flex items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    activeSection === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4 ml-2" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Profile & Notifications */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer relative"
                  >
                    <Bell className="h-7 w-7" />
                    {notifications.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {notifications.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">الإشعارات</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="cursor-pointer flex items-center space-x-2 space-x space-x-reverse"
                  >
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.firstName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium hidden md:inline">
                      {user?.firstName}
                    </span>
                    <ChevronDown className="h-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer flex items-center space-x-2 space-x-reverse"
                  >
                    <User className="w-4 h-4" />
                    <span>حسابك</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center space-x-2 space-x-reverse text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {activeSection === "home" ? renderHomeContent() : renderSection()}
      </div>
      <Footer />
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
        مرحبا بك في وكيلي
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        منصتك القانونية الشاملة للحصول على الاستشارات والخدمات القانونية
        المتميزة
      </p>
    </div>
  );
};
const Logo = () => {
  return (
    <div className="flex items-center">
      <Scale className="w-8 h-8 text-primary ml-2" />
      <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        وكيلي
      </span>
    </div>
  );
};

export default HomePage;
