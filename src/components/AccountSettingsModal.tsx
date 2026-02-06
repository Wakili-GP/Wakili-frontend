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
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { clientProfileService } from "@/services/clientProfile-services";

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSettingsModals: React.FC<AccountSettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

    try {
      const response = await clientProfileService.updatePassword({
        oldPassword,
        newPassword,
      });

      if (response.success) {
        toast.success("تم تحديث كلمة المرور بنجاح");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onOpenChange(false);
      } else {
        setPasswordError("فشل تحديث كلمة المرور. حاول مرة أخرى");
      }
    } catch {
      setPasswordError("حدث خطأ أثناء تحديث كلمة المرور");
      toast.error("حدث خطأ أثناء تحديث كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="mt-3">
          <DialogTitle className="text-xl text-center font-bold flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            تغيير كلمة المرور
          </DialogTitle>
          <DialogDescription className="text-center">
            قم بتحديث كلمة المرور الخاصة بحسابك
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
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
                className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModals;
