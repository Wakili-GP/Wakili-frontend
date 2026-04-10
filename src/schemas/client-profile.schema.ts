import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "الاسم الأول يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم الأول طويل جداً"),
  lastName: z
    .string()
    .min(2, "اسم العائلة يجب أن يكون حرفين على الأقل")
    .max(50, "اسم العائلة طويل جداً"),
  country: z.string().min(1, "يرجى اختيار الدولة"),
  city: z.string().min(1, "يرجى اختيار المدينة"),
  phoneCode: z.string().min(1, "يرجى اختيار كود الدولة"),
  phoneNumber: z
    .string()
    .min(7, "رقم الهاتف قصير جداً")
    .max(15, "رقم الهاتف طويل جداً")
    .regex(/^\d+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  bio: z.string().max(500, "النبذة يجب أن تكون أقل من 500 حرف").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
      .string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .max(100, "كلمة المرور طويلة جداً"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمة المرور الجديدة غير متطابقة",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "كلمة المرور الجديدة مطابقة للحالية",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
