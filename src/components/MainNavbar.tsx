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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Scale, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

interface MainNavbarProps {
  fixed?: boolean;
  onLoginClick?: () => void;
}

const navTabs = [
  { path: "/", label: "حول المنصة" },
  { path: "/ai-chat", label: "الذكاء الاصطناعي" },
  { path: "/lawyers", label: "اعثر علي محامٍ" },
  { path: "/ai-contract-review", label: "حلل عقدا" },
  { path: "/forum", label: "اسئلة شائعة" },
  { path: "/articles", label: "مقالات" },
];

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

const MainNavbar = ({ fixed = false, onLoginClick }: MainNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();

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

  return (
    <nav
      className={`border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50 ${
        fixed ? "fixed top-0 w-full shadow-card" : "sticky top-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Scale className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              وكيلك
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center w-[86%] max-w-6xl gap-4 absolute left-1/2 -translate-x-1/2">
            {navTabs.map((tab) => (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`cursor-pointer py-2 px-5 rounded-xl transition-all duration-300 font-medium ${
                  location.pathname === tab.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            {isAuthenticated ? (
              <>
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
                      className="cursor-pointer flex items-center space-x-2 space-x-reverse"
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
                      onClick={() => navigate("/profile")}
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
              </>
            ) : (
              <Button
                className="cursor-pointer"
                variant="hero"
                size="sm"
                onClick={() => {
                  if (onLoginClick) {
                    onLoginClick();
                    return;
                  }
                  navigate("/");
                }}
              >
                ابدأ الآن
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
