import { z } from "zod";
export const profileSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "اسم العائلة مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phoneNumber: z.string().min(8, "رقم الهاتف مطلوب"),
  country: z.string().min(1, "الدولة مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  bio: z.string().max(200, "يجب أن لا يتجاوز 200 حرف"),
  summary: z
    .string()
    .max(600, "يجب أن لا يتجاوز 600 حرف")
    .nullable()
    .optional(),
  phoneSessionPrice: z.number().nullable().optional(),
  inOfficeSessionPrice: z.number().nullable().optional(),
  profileImage: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
