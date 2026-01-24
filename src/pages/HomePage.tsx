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

import { useState } from "react";
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
const HomePage = () => {
  const [activeSection, setActiveSection] = useState("");
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
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
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="hidden md:flex items-center space-x-8">
              {[
                {
                  id: "الذكاء الاصطناعي",
                  label: "الذكاء الاصطناعي",
                  icon: MessageCircle,
                },
                { id: "اختر محامي", label: "محامي", icon: Users },
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
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer flex items-center space-x-2 space-x-reverse">
                    <User className="w-4 h-4" />
                    <span>حسابك</span>
                  </DropdownMenuItem>{" "}
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
      <div className="container mx-auto px-4 py-8">{renderHomeContent()}</div>
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
