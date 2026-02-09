import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Scale,
  User,
  Briefcase,
  Building2,
  Mail,
  RefreshCw,
  Loader,
} from "lucide-react";
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
import { toast } from "@/components/ui/sonner";
import { authService } from "@/services/auth-services";
import { useAuth } from "@/context/AuthContext";

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
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [resetCode, setResetCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fullName, setFullName] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (!open && !showEmailVerification) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setResetCode("");
      setFullName("");
    }
  }, [open, mode, showEmailVerification]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await authService.login({
      email,
      password,
    });

    if (response.success) {
      toast.success("تم تسجيل الدخول بنجاح!", {
        description: "مرحباً بك في وكيلي",
      });
      onOpenChange(false);
      navigate("/home");
    } else {
      toast.error("خطأ في تسجيل الدخول", {
        description: response.error || "تأكد من البريد والرمز",
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await authService.forgotPassword({ email });

    if (response.success) {
      toast.success("تم إرسال رمز التحقق", {
        description: "تحقق من بريدك الإلكتروني",
      });
      onSwitchMode("reset-password");
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل إرسال رمز التحقق",
      });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}[\]|\\:;"'<>,./]).{12,}$/;

    if (!selectedUserType) {
      toast.error("خطأ", {
        description: "اختر نوع المستخدم",
      });
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error("كلمة مرور ضعيفة", {
        description:
          "كلمة المرور يجب أن تكون 12 حرفًا على الأقل وتحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("خطأ", {
        description: "كلمات المرور غير متطابقة",
      });
      return;
    }

    setIsLoading(true);

    const [firstName, ...lastNameParts] = fullName.trim().split(" ");
    const lastName = lastNameParts.join(" ");

    const userType = selectedUserType === "lawyer" ? "lawyer" : "client";

    const response = await authService.register({
      email,
      password,
      firstName,
      lastName,
      userType,
      acceptTerms: true,
    });

    if (response.success) {
      setRegistrationEmail(email);
      setShowEmailVerification(true);
      onOpenChange(false);
      toast.success("تم إنشاء الحساب!", {
        description: "يرجى تأكيد بريدك الإلكتروني",
      });
    } else {
      toast.error("خطأ في التسجيل", {
        description: response.error || "فشل إنشاء الحساب",
      });
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("خطأ", {
        description: "كلمات المرور غير متطابقة",
      });
      return;
    }

    setIsLoading(true);

    const response = await authService.resetPassword({
      email,
      code: resetCode,
      newPassword: password,
    });

    if (response.success) {
      toast.success("تم تحديث كلمة المرور!", {
        description: "يمكنك الآن تسجيل الدخول",
      });
      onSwitchMode("login");
      setEmail("");
      setPassword("");
      setResetCode("");
      setConfirmPassword("");
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل تحديث كلمة المرور",
      });
    }
    setIsLoading(false);
  };

  const handleEmailVerified = async () => {
    const emailToUse = registrationEmail || email;
    try {
      await login(emailToUse, password);
    } catch (error) {
      toast.error("خطأ في تسجيل الدخول", {
        description:
          error instanceof Error ? error.message : "تعذر تسجيل الدخول",
      });
      console.error("Login error:", error);
      return;
    }

    setShowEmailVerification(false);
    toast.success("تم التحقق بنجاح!", {
      description: "مرحباً بك في وكيلي",
    });
    onOpenChange(false);

    // Redirect based on user type
    console.log("Selected user type:", selectedUserType);
    if (selectedUserType === "lawyer") {
      console.log("Redirecting to lawyer onboarding...");
      navigate("/verify/lawyer");
    } else {
      navigate("/home");
    }
  };

  const handleGoogleAuth = async () => {
    toast.info("قيد التطوير", {
      description: "ستتوفر طريقة تسجيل الدخول عبر Google قريباً",
    });
  };
  const userTypes = [
    {
      id: "client",
      label: "عميل",
      icon: User,
      comingSoon: false,
    },
    {
      id: "lawyer",
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
            <Button
              type="button"
              variant="secondary"
              className="w-full mb-4 cursor-pointer"
              disabled={isLoading}
              onClick={handleGoogleAuth}
            >
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
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
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
        {mode === "register" && (
          <div>
            <Button
              type="button"
              variant="secondary"
              className="w-full mb-4"
              disabled={isLoading}
              onClick={handleGoogleAuth}
            >
              <Globe className="ml-2" />
              التسجيل باستخدام Google
            </Button>
            <Divider />
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-4">
                <Label className="text-base font-medium">نوع المستخدم</Label>
                <div className="grid grid-cols-3 gap-3">
                  {userTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isDisabled = type.comingSoon;
                    return (
                      <div
                        key={type.id}
                        onClick={() =>
                          !isDisabled && setSelectedUserType(type.id)
                        }
                        className={`relative rounded-lg border-2 p-4 text-center transition-all ${
                          isDisabled
                            ? "cursor-not-allowed opacity-60 border-border"
                            : `cursor-pointer hover:shadow-md ${selectedUserType === type.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary-50"}`
                        }`}
                      >
                        {type.comingSoon && (
                          <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            قريباً
                          </span>
                        )}
                        <IconComponent
                          className={`mx-auto mb-2 h-6 w-6 ${isDisabled ? "text-muted-foreground/50" : selectedUserType === type.id ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <p
                          className={`text-sm font-medium $${isDisabled ? "text-muted-foreground/50" : selectedUserType == type.id ? "text-primary" : "text-foreground"}`}
                        >
                          {type.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullname">الاسم الكامل</Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="الاسم الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">البريد الإلكتروني</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">كلمة المرور</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="cursor-pointer w-full"
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              لديك حساب بالفعل؟
              <button
                type="button"
                className="cursor-pointer text-primary mr-2 underline underline-offset-4"
                onClick={() => onSwitchMode("login")}
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        )}
        {mode === "reset-password" && (
          <div>
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <Label htmlFor="reset-code">رمز التحقق</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="000000"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widset"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                العودة إلى
                <button
                  type="button"
                  className="mr-2 cursor-pointer text-primary underline underline-offset-4"
                  onClick={() => onSwitchMode("login")}
                >
                  تسجيل الدخول
                </button>
              </p>
            </form>
          </div>
        )}
      </DialogContent>
      <EmailVerificationModal
        open={showEmailVerification}
        onOpenChange={setShowEmailVerification}
        email={registrationEmail}
        onVerified={handleEmailVerified}
        userType={selectedUserType}
      />
    </Dialog>
  );
};

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified: () => void;
  userType: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  open,
  onOpenChange,
  email,
  onVerified,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("خطأ", {
        description: "يرجى إدخال الرمز المكون من 6 أرقام",
      });
      return;
    }

    setIsLoading(true);

    const response = await authService.verifyEmail({
      email,
      code,
    });

    if (response.success) {
      toast.success("تم التحقق بنجاح!", {
        description: "تم تأكيد بريدك الإلكتروني",
      });
      setIsLoading(false);
      onVerified();
    } else {
      toast.error("خطأ في التحقق", {
        description: response.error || "الرمز غير صحيح أو منتهي الصلاحية",
      });
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    const response = await authService.resendVerificationEmail(email);

    if (response.success) {
      toast.success("تم إرسال الرمز", {
        description: "تحقق من بريدك الإلكتروني",
      });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      toast.error("خطأ", {
        description: response.error || "فشل إرسال الرمز",
      });
    }
    setIsResending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-center sm:text-center items-center">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">
            تأكيد البريد الإلكتروني
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            تم إرسال رمز التحقق إلى
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input */}
          <div
            className="flex justify-center gap-2"
            dir="ltr"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            className="w-full cursor-pointer"
            disabled={isLoading || otp.some((d) => !d)}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 ml-2 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "تأكيد"
            )}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              لم تستلم الرمز؟
            </p>
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="text-primary"
            >
              <RefreshCw
                className={`w-4 h-4 ml-2 ${isResending ? "animate-spin" : ""}`}
              />
              {countdown > 0
                ? `إعادة الإرسال (${countdown}ث)`
                : "إعادة إرسال الرمز"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals;
