import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    code: z.string().min(1, "رمز التحقق مطلوب"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل، تحتوي على حرف كبير، حرف صغير، رقم ورمز خاص",
      ),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "الاسم الأول مطلوب"),
    lastName: z.string().min(2, "الاسم الأخير مطلوب"),
    email: z.string().email("بريد إلكتروني غير صالح"),
    userType: z.enum(["client", "lawyer"], {
      required_error: "اختر نوع المستخدم",
    }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-{}[\]|\\:;"'<>,./]).{12,}$/,
        "كلمة المرور يجب أن تكون 12 حرفًا على الأقل وتحتوي على حرف كبير، حرف صغير، رقم، ورمز خاص",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
