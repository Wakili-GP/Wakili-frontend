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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginInput,
  forgotPasswordSchema,
  type ForgotPasswordInput,
  resetPasswordSchema,
  type ResetPasswordInput,
  registerSchema,
  type RegisterInput,
} from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";

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
  const [emailVerificationModal, showEmailVerificationModal] = useState(false);
  const [registrationEmailToConfirm, setRegistrationEmailToConfirm] =
    useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      const response = await authService.login({ email, password });
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("تم تسجيل الدخول بنجاح!", {
        description: "مرحباً بك في وكيلي",
      });
      onOpenChange(false);
      console.log("Login Data:", data?.user?.userType);
      navigate("/home");
    },
    onError: (error) => {
      toast.error("خطأ في تسجيل الدخول", {
        description:
          error instanceof Error ? error.message : "تأكد من البريد والرمز",
      });
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email }: ForgotPasswordInput) =>
      authService.forgotPassword({ email }),
    onSuccess: () => {
      toast.success("تم إرسال رمز التحقق", {
        description: "تحقق من بريدك الإلكتروني",
      });
      onSwitchMode("reset-password");
    },
    onError: (error) => {
      toast.error("خطأ", {
        description:
          error instanceof Error ? error.message : "فشل إرسال رمز التحقق",
      });
    },
  });

  const resetPasswordForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: ResetPasswordInput) => {
      return authService.resetPassword({
        email: forgotPasswordForm.getValues("email"),
        code: values.code,
        newPassword: values.password,
      });
    },
    onSuccess: () => {
      toast.success("تم تحديث كلمة المرور!", {
        description: "يمكنك الآن تسجيل الدخول",
      });
      onSwitchMode("login");
      resetPasswordForm.reset();
    },
    onError: (error) => {
      toast.error("خطأ في تحديث كلمة المرور", {
        description:
          error instanceof Error ? error.message : "فشل تحديث كلمة المرور",
      });
    },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterInput) => {
      const userType = values.userType === "lawyer" ? "lawyer" : "client";
      return authService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        userType,
        acceptTerms: true,
      });
    },
    onSuccess: () => {
      setRegistrationEmailToConfirm(registerForm.getValues("email"));
      showEmailVerificationModal(true);
      onOpenChange(false);
      toast.success("تم إنشاء الحساب!", {
        description: "يرجى تأكيد بريدك الإلكتروني",
      });
      registerForm.reset();
    },
    onError: (error) => {
      toast.error("خطأ في التسجيل", {
        description:
          error instanceof Error ? error.message : "فشل إنشاء الحساب",
      });
    },
  });

  // Reset forms when both auth and verification dialogs are closed
  useEffect(() => {
    if (!open && !emailVerificationModal) {
      loginForm.reset();
      forgotPasswordForm.reset();
      resetPasswordForm.reset();
      registerForm.reset();
    }
  }, [
    open,
    emailVerificationModal,
    loginForm,
    forgotPasswordForm,
    resetPasswordForm,
    registerForm,
  ]);

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
              onClick={handleGoogleAuth}
            >
              <Globe className="ml-2" /> الدخول باستخدام Google
            </Button>

            <Divider />

            <form
              className="space-y-4"
              onSubmit={loginForm.handleSubmit((data) =>
                loginMutation.mutate(data),
              )}
            >
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@email.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
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
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? "جاري تسجيل الدخول..."
                  : "تسجيل الدخول"}
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
            <form
              onSubmit={forgotPasswordForm.handleSubmit((data) =>
                forgotPasswordMutation.mutate(data),
              )}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="forgot-email">البريد الإلكتروني</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="example@email.com"
                  {...forgotPasswordForm.register("email")}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending
                  ? "جاري الإرسال..."
                  : "إرسال رمز التحقق"}
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
              disabled={registerMutation.isPending}
              onClick={handleGoogleAuth}
            >
              <Globe className="ml-2" />
              التسجيل باستخدام Google
            </Button>
            <Divider />
            <form
              className="space-y-4"
              onSubmit={registerForm.handleSubmit((data) =>
                registerMutation.mutate(data),
              )}
            >
              {/* User Type */}
              <div className="space-y-4">
                <Label className="text-base font-medium">نوع المستخدم</Label>
                <div className="grid grid-cols-3 gap-3">
                  {userTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isDisabled = type.comingSoon;
                    const isSelected =
                      registerForm.watch("userType") === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() => {
                          if (isDisabled) return;
                          if (type.id === "lawyer") {
                            navigate("/apply/lawyer");
                            return;
                          }
                          registerForm.setValue(
                            "userType",
                            type.id as "client" | "lawyer",
                            { shouldValidate: true },
                          );
                        }}
                        className={`relative rounded-lg border-2 p-4 text-center transition-all ${
                          isDisabled
                            ? "cursor-not-allowed opacity-60 border-border"
                            : `cursor-pointer hover:shadow-md ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary-50"}`
                        }`}
                      >
                        {type.comingSoon && (
                          <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            قريباً
                          </span>
                        )}
                        <IconComponent
                          className={`mx-auto mb-2 h-6 w-6 ${isDisabled ? "text-muted-foreground/50" : isSelected ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <p
                          className={`text-sm font-medium ${isDisabled ? "text-muted-foreground/50" : isSelected ? "text-primary" : "text-foreground"}`}
                        >
                          {type.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {registerForm.formState.errors.userType && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.userType.message}
                  </p>
                )}
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    type="text"
                    {...registerForm.register("firstName")}
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة</Label>
                  <Input
                    id="lastName"
                    type="text"
                    {...registerForm.register("lastName")}
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="reg-email">البريد الإلكتروني</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="reg-password">كلمة المرور</Label>
                <Input
                  id="reg-password"
                  type="password"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  {...registerForm.register("confirmPassword")}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="cursor-pointer w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? "جاري إنشاء الحساب..."
                  : "إنشاء حساب"}
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
            <form
              className="space-y-4"
              onSubmit={resetPasswordForm.handleSubmit((data) =>
                resetPasswordMutation.mutate(data),
              )}
            >
              <div className="space-y-2">
                <Label htmlFor="reset-code">رمز التحقق</Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="000000"
                  className="text-center text-2xl tracking-widset"
                  {...resetPasswordForm.register("code")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...resetPasswordForm.register("password")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  {...resetPasswordForm.register("confirmPassword")}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending
                  ? "جاري التحديث..."
                  : "تحديث كلمة المرور"}
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
        open={emailVerificationModal}
        onOpenChange={showEmailVerificationModal}
        email={registrationEmailToConfirm}
      />
    </Dialog>
  );
};

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  open,
  onOpenChange,
  email,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
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

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return authService.verifyEmail({ email, code });
    },
    onSuccess: () => {
      toast.success("تم التحقق بنجاح!", {
        description: "تم تأكيد بريدك الإلكتروني",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("خطأ في التحقق", {
        description:
          error instanceof Error
            ? error.message
            : "الرمز غير صحيح أو منتهي الصلاحية",
      });
    },
  });
  const resendMutation = useMutation({
    mutationFn: () => authService.resendVerificationEmail(email),
    onSuccess: () => {
      toast.success("تم إرسال الرمز", {
        description: "تحقق من بريدك الإلكتروني",
      });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
    onError: (error) => {
      toast.error("خطأ", {
        description: error instanceof Error ? error.message : "فشل إرسال الرمز",
      });
    },
  });

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
            onClick={() => verifyMutation.mutate(otp.join(""))}
            className="w-full cursor-pointer"
            disabled={verifyMutation.isPending || otp.some((d) => !d)}
          >
            {verifyMutation.isPending ? (
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
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending || countdown > 0}
              className="cursor-pointer text-primary"
            >
              <RefreshCw
                className={`w-4 h-4 ml-2 ${resendMutation.isPending ? "animate-spin" : ""}`}
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
