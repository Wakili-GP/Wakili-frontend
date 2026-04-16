import { useState, type InputHTMLAttributes } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/schemas/client-profile.schema";

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  isChangingPassword?: boolean;
}

const PasswordInput = ({
  field,
  id,
}: {
  field: InputHTMLAttributes<HTMLInputElement>;
  id: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} {...field} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

const AccountSettingsModal = ({
  open,
  onOpenChange,
  onChangePassword,
  isChangingPassword = false,
}: AccountSettingsModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await onChangePassword(values.currentPassword, values.newPassword);
      reset();
      onOpenChange(false);
    } catch {
      setError("root", {
        message: "حدث خطأ أثناء تحديث كلمة المرور",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="old-password">كلمة المرور الحالية</Label>
            <PasswordInput
              field={register("currentPassword")}
              id="old-password"
            />
            {errors.currentPassword && (
              <p className="text-destructive text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <PasswordInput field={register("newPassword")} id="new-password" />
            {errors.newPassword && (
              <p className="text-destructive text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">
              تأكيد كلمة المرور الجديدة
            </Label>
            <PasswordInput
              field={register("confirmPassword")}
              id="confirm-new-password"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-destructive text-sm">{errors.root.message}</p>
          )}

          <Button
            type="submit"
            className="cursor-pointer w-full"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;
