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
import { Bell, ChevronDown, LayoutDashboard, LogOut, Scale, User } from "lucide-react";
import { useAuth } from "@/stores/auth.store";
import { toast } from "@/components/ui/sonner";
import { useAuthModalStore } from "@/stores/auth-modal.store";
import { NotificationPopover } from "./NotificationPopover";

interface MainNavbarProps {
  fixed?: boolean;
  onLoginClick?: () => void;
}

const navTabs = [
  { path: "/", label: "حول المنصة" },
  { path: "/find-lawyers", label: "اعثر علي محامٍ" },
  { path: "/ai-contract-review", label: "حلل عقدا" },
  { path: "/forum", label: "اسئلة شائعة" },
  { path: "/articles", label: "مقالات" },
];

const MainNavbar = ({ fixed = false, onLoginClick }: MainNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();
  const openLogin = useAuthModalStore((state) => state.openLogin);

  const currentLocation = useLocation();
  console.log("currentLocation from Inside Navbar", currentLocation)

  const handleNavClick = (path: string) => {
    if (path === location.pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(path);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح", {
        description: "نراك قريباً",
      });
      if (currentLocation.pathname.startsWith("/dashboard") || currentLocation.pathname.startsWith("/profile")) {
        navigate("/");
      }
    } catch {
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  return (
    <nav
      className={`border-b bg-white backdrop-blur supports-backdrop-filter:bg-white z-50 ${fixed ? "fixed top-0 w-full shadow-card" : "sticky top-0"
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

          <div className="hidden md:flex items-center justify-center w-[86%] max-w-6xl gap-8 absolute left-1/2 -translate-x-1/2">
            {navTabs.map((tab) => (
              <button
                key={tab.path}
                onClick={() => handleNavClick(tab.path)}
                className={`cursor-pointer py-2 px-5 rounded-xl transition-all duration-300 font-medium ${location.pathname === tab.path
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
                <NotificationPopover />

                <DropdownMenu modal={false}>
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
                    {user?.userType === "Lawyer" &&
                      user?.status === "SubmittedAndApproved" && (
                        <DropdownMenuItem
                          dir="rtl"
                          onClick={() => navigate("/lawyer/dashboard")}
                          className="cursor-pointer flex items-center space-x-2 space-x-reverse"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>لوحة التحكم</span>
                        </DropdownMenuItem>
                      )}
                    <DropdownMenuItem
                      dir="rtl"
                      onClick={() => {
                        if (user?.userType === "Client") {
                          navigate("/profile");
                          return;
                        }

                        if (user?.userType === "Lawyer") {
                          if (user.status === "Unfinished") {
                            navigate("/lawyer-onboarding");
                            toast.info(
                              "اكمل ملفك الشخصي لتتمكن من استخدام حسابك",
                              { description: "يرجى إكمال معلوماتك الشخصية" },
                            );
                          } else if (user.status === "SubmittedAndNotApproved") {
                            navigate("/lawyer-onboarding");
                            toast.info(
                              "طلبك قيد المراجعة",
                              { description: "سيتم إشعارك عند اكتمال عملية التحقق" },
                            );
                          } else if (user.status === "SubmittedAndApproved") {
                            navigate(`/lawyer/${user.id}`);
                          }
                        }
                      }}
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
                size="lg"
                onClick={() => {
                  if (onLoginClick) {
                    onLoginClick();
                    return;
                  }
                  openLogin();
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
