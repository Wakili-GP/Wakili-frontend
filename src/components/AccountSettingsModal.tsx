import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
}
const AccountSettingsModals: React.FC<AccountSettingsModalProps> = ({
  open,
  onOpenChange,
  currentEmail,
}) => {
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!newEmail || !confirmEmail) {
      setEmailError("يرجى ملء جميع الحقول");
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError("يرجى إدخال بريد إلكتروني صالح");
      return;
    }

    if (newEmail !== confirmEmail) {
      setEmailError("البريد الإلكتروني غير متطابق");
      return;
    }

    if (newEmail === currentEmail) {
      setEmailError("البريد الإلكتروني الجديد مطابق للحالي");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // toast({
    //   title: "تم تحديث البريد الإلكتروني",
    //   description: "سيتم إرسال رابط التأكيد إلى بريدك الإلكتروني الجديد",
    // });
    setIsLoading(false);
    setNewEmail("");
    setConfirmEmail("");
    onOpenChange(false);
  };
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("يرجى ملء جميع الحقول");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError("كلمة المرور الجديدة مطابقة للحالية");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // toast({
    //   title: "تم تحديث كلمة المرور",
    //   description: "تم تغيير كلمة المرور بنجاح",
    // });
    setIsLoading(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="mt-3">
          <DialogTitle className="text-xl text-center font-bold">
            إعدادات الحساب
          </DialogTitle>
          <DialogDescription className="text-center">
            تغيير البريد الإلكتروني أو كلمة المرور
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger
              value="email"
              className="cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              البريد الإلكتروني
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="cursor-pointer flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              كلمة المرور
            </TabsTrigger>
          </TabsList>
          <TabsContent dir="rtl" value="email" className="mt-4">
            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  البريد الإلكتروني الحالي
                </p>
                <p className="font-medium">{currentEmail}</p>{" "}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">البريد الإلكتروني الجديد</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="exapmle@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-email">تأكيد البريد الإلكتروني</Label>
                <Input
                  id="confirm-email"
                  type="email"
                  placeholder="example@email.com"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {emailError}
                </div>
              )}
              <Button
                type="submit"
                className="cursor-pointer w-full"
                disabled={isLoading}
              >
                {isLoading ? "جاري التحديث..." : "تحديث البريد الإلكتروني"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent dir="rtl" value="password" className="mt-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">كلمة المرور الحالية</Label>
                <div className="relative">
                  <Input
                    id="old-password"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  تأكيد كلمة المرور الجديدة
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </div>
              )}
              <Button
                type="submit"
                className="cursor-pointer w-full"
                disabled={isLoading}
              >
                {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default AccountSettingsModals;
