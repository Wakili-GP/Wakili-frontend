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
import ContractReview from "../components/contract-review/ContractReview.tsx";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  Sparkles,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import Footer from "../components/Footer.tsx";
import ComingSoon from "../components/ComingSoon.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { toast } from "@/components/ui/sonner";
import EnhancedChatbot from "@/components/EnhancedChatbot.tsx";
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
    } catch {
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
      <InteractiveChatbotSection setActiveSection={setActiveSection} />
    </div>
  );
  const renderSection = () => {
    switch (activeSection) {
      case "الذكاء الاصطناعي":
        return (
          <div className="space-y-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                  <MessageCircle className="w-16 h-16 text-primary relative z-10" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                تحدث مع الذكاء الاصطناعي
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                احصل على استشارات قانونية فورية وإجابات دقيقة على أسئلتك من خلال
                مساعدنا الذكي المتطور
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
                  <CardHeader>
                    <Sparkles className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">إجابات فورية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      احصل على إجابات سريعة ودقيقة لاستفساراتك القانونية
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
                  <CardHeader>
                    <Scale className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">خبرة قانونية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      مدرب على أحدث القوانين والأنظمة في العالم العربي
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-all duration-300 border-primary/20">
                  <CardHeader>
                    <MessageCircle className="w-8 h-8 mx-auto text-primary mb-2" />
                    <CardTitle className="text-lg">متاح دائماً</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      خدمة متاحة 24/7 لمساعدتك في أي وقت
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <EnhancedChatbot />
              </div>
            </div>
          </div>
        );
      case "محامي":
        return <LawyerSearch />;

      case "حلل عقدا":
        return <ContractReview />;

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
                <PopoverContent className="w-80 p-0" align="center">
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
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    dir="rtl"
                    onClick={handleProfileClick}
                    className="cursor-pointer flex items-center space-x-2 space-x-reverse"
                  >
                    <User className="w-4 h-4" />
                    <span>حسابك</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    dir="rtl"
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
type InteractiveChatbotSectionProps = {
  setActiveSection: (activeSection: string) => void;
};
const InteractiveChatbotSection = ({
  setActiveSection,
}: InteractiveChatbotSectionProps) => {
  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          لديك سؤال قانوني؟
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          اسأل الذكاء الاصطناعي المتخصص في القانون واحصل على إجابات فورية ودقيقة
        </p>
      </div>

      {/* Interactive Chat Interface */}
      <Card className="relative overflow-hidden bg-linear-to-br from-primary/5 via-primary/8 to-primary/12 border-primary/30 hover:border-primary/50 transition-all duration-500 shadow-2xl max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-8 relative z-10">
          {/* Chat Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <MessageCircle className="w-8 h-8 text-primary relative z-10" />
              </div>
              <h3 className="text-xl font-bold ml-2">مساعد وكيلك القانوني</h3>
              <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />
                <span>متاح الآن</span>
              </div>
            </div>
          </div>

          {/* Example Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              "ما هي حقوقي في حالة فصل تعسفي من العمل؟",
              "كيف أحمي حقوقي في عقد الإيجار؟",
              "ما هي إجراءات تأسيس شركة جديدة؟",
              "كيف أتعامل مع نزاع تجاري؟",
            ].map((question, index) => (
              <Card
                key={index}
                className="group cursor-pointer bg-linear-to-r from-background/80 to-background/60 hover:from-primary/10 hover:to-primary/5 border-muted hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  const input = document.getElementById(
                    "question-input",
                  ) as HTMLInputElement;
                  if (input) {
                    input.value = question;
                    input.focus();
                  }
                }}
              >
                <CardContent className="p-3">
                  <p className="text-sm text-right group-hover:text-primary transition-colors duration-300">
                    {question}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Question Input */}
          <div className="relative">
            <div className="flex items-center space-x-reverse space-x-2 bg-background/80 backdrop-blur-sm rounded-2xl border border-primary/20 focus-within:border-primary/50 transition-all duration-300 p-2 shadow-inner">
              <input
                id="question-input"
                type="text"
                placeholder="اكتب سؤالك القانوني هنا..."
                className="flex-1 bg-transparent text-right px-4 py-3 text-lg focus:outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    setActiveSection("الذكاء الاصطناعي");
                    // Store the question for the chatbot
                    localStorage.setItem(
                      "pendingQuestion",
                      e.currentTarget.value,
                    );
                  }
                }}
              />
              <Button
                size="lg"
                className="rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const input = document.getElementById(
                    "question-input",
                  ) as HTMLInputElement;
                  if (input && input.value.trim()) {
                    setActiveSection("الذكاء الاصطناعي");
                    localStorage.setItem("pendingQuestion", input.value);
                  }
                }}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                اسأل الآن
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="flex justify-center items-center space-x-8 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Zap className="w-4 h-4 text-primary ml-1" />
              <span>إجابات فورية</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-primary ml-1" />
              <span>معلومات موثوقة</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 text-primary ml-1" />
              <span>متاح 24/7</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default HomePage;
