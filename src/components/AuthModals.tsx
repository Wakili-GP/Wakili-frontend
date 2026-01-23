import React, { useState } from "react";
import { Globe, Scale, User, Briefcase, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { div } from "framer-motion/client";

export type AuthMode =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password";
interface AuthModalProps {
  open: boolean;
  mode: AuthMode;
  onOpenChange: (open: boolean) => void;
  onSwitchMode: (open: AuthMode) => void;
}

const HeaderBand = () => (
  <div className="flex flex-col items-center text-center mb-4">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
      <Scale className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-foreground">منصة وكيلي</h3>
  </div>
);
const Divider = () => (
  <div className="relative my-4">
    <div className="border-t border-border" />
    <span className="absolute -top-3 right-1/2 translate-x-1/2 bg-background px-3 text-sm text-muted-foreground">
      أو
    </span>
  </div>
);

const AuthModals: React.FC<AuthModalProps> = ({
  open,
  mode,
  onOpenChange,
  onSwitchMode,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const userTypes = [
    {
      id: "client",
      label: "عميل",
      icon: User,
      comingSoon: false,
    },
    {
      id: "freelance-lawyer",
      label: "محامي حر",
      icon: Briefcase,
      comingSoon: false,
    },
    {
      id: "law-office",
      label: "مكتب محاماة",
      icon: Building2,
      comingSoon: true,
    },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center items-center">
          <HeaderBand />
          <DialogTitle className="text-2xl font-bold text-foreground">
            {mode === "login" && "تسجيل الدخول"}
            {mode === "register" && "إنشاء حساب جديد"}
            {mode === "forgot-password" && "استعادة كلمة المرور"}
            {mode === "reset-password" && "إعادة تعيين كلمة المرور"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "login" && "مرحباً بعودتك!"}
            {mode === "register" && "انضم إلينا خلال ثوانٍ"}
            {mode === "forgot-password" && "سنرسل لك رمز التحقق"}
            {mode === "reset-password" && "أدخل الرمز وكلمة المرور الجديدة"}
          </DialogDescription>
        </DialogHeader>
        {mode === "login" && (
          <div>
            <Button type="button" variant="secondary" className="w-full mb-4">
              <Globe className="ml-2" /> الدخول باستخدام Google
            </Button>

            <Divider />

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    تذكرني
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => onSwitchMode("forgot-password")}
                  className="text-sm text-primary hover:underline underline-offset-4 cursor-pointer"
                >
                  هل نسيت كلمة المرور؟
                </button>
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              ليس لديك حساب بالفعل؟{" "}
              <button
                type="button"
                className="text-primary underline underline-offset-4 cursor-pointer"
                onClick={() => onSwitchMode("register")}
              >
                سجل الآن
              </button>
            </p>
          </div>
        )}

        {mode === "forgot-password" && (
          <div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">البريد الإلكتروني</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              تذكرت كلمة المرور؟{" "}
              <button
                type="button"
                className="cursor-pointer text-primary underline underline-offset-4"
                onClick={() => onSwitchMode("login")}
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals;
