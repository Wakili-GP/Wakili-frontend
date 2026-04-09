import { z } from "zod";

export const basicInfoSchema = z.object({
  profileImage: z
    .instanceof(File, { message: "صورة الملف الشخصي مطلوبة" })
    .nullable(),
  phoneCode: z.string().min(1, "مطلوب"),
  phoneNumber: z.string().min(7, "رقم الهاتف غير صحيح"),
  country: z.string().min(1, "الدولة مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  bio: z.string().min(100, "الملخص المهني مطلوب (100 حرف على الأقل)"),
  // There is a transformation here
  yearsOfExperience: z.coerce.number({ message: "مطلوب" }).min(0).max(60),
  practiceAreas: z.array(z.number()).min(1, "اختر مجال ممارسة واحد على الأقل"),
  sessionTypes: z.array(z.string()).min(1, "اختر نوع جلسة واحد على الأقل"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
