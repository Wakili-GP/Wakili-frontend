import { z } from "zod";

export const basicInfoSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الاسم الأخير مطلوب"),
  profileImage: z.union([z.instanceof(File), z.string()]).nullable(),
  phoneNumber: z.string().min(7, "رقم الهاتف غير صحيح"),
  country: z.string().min(1, "الدولة مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  bio: z.string().min(100, "الملخص المهني مطلوب (100 حرف على الأقل)"),
  yearsOfExperience: z.coerce.number({ message: "مطلوب" }).min(0).max(60),
  practiceAreas: z.array(z.number()).min(1, "اختر مجال ممارسة واحد على الأقل"),
  sessionTypes: z.array(z.number()).min(1, "اختر نوع جلسة واحد على الأقل"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export const academicQualificationSchema = z.object({
  degreeType: z.string().min(1, "مطلوب"),
  fieldOfStudy: z.string().min(1, "مطلوب"),
  universityName: z.string().min(1, "مطلوب"),
  graduationYear: z.string().min(1, "مطلوب"),
  document: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
});

export const professionalCertificationSchema = z.object({
  certificateName: z.string().min(1, "مطلوب"),
  issuingOrganization: z.string().min(1, "مطلوب"),
  yearObtained: z.string().min(1, "مطلوب"),
  document: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
});

export const educationSchema = z.object({
  academicQualifications: z
    .array(academicQualificationSchema)
    .min(1, "أضف مؤهل علمي واحد على الأقل"),
  professionalCertifications: z.array(professionalCertificationSchema),
});

export type EducationFormData = z.infer<typeof educationSchema>;

export const workExperienceSchema = z
  .object({
    jobTitle: z.string().min(1, "مطلوب"),
    organizationName: z.string().min(1, "مطلوب"),
    startYear: z.string().min(1, "مطلوب"),
    endYear: z.string().optional(),
    isCurrentJob: z.boolean(),
    description: z.string().min(100, "الوصف مطلوب (100 حرف على الأقل)"),
  })
  .refine((data) => data.isCurrentJob || !!data.endYear, {
    message: "مطلوب",
    path: ["endYear"],
  });

export const experienceSchema = z.object({
  workExperiences: z
    .array(workExperienceSchema)
    .min(1, "أضف خبرة عملية واحدة على الأقل"),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

export const verificationDocumentSchema = z
  .union([z.instanceof(File), z.string()])
  .nullable();

export const verificationSchema = z
  .object({
    nationalIdFront: verificationDocumentSchema,
    nationalIdBack: verificationDocumentSchema,
    lawyerLicense: verificationDocumentSchema,
    lawyerLicenseNumber: z.string().min(1, "مطلوب"),
    lawyerLicenseIssuingAuthority: z.string().min(1, "مطلوب"),
    lawyerLicenseYearOfIssue: z.string().min(1, "مطلوب"),
  })
  .superRefine((data, ctx) => {
    if (!data.nationalIdFront) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "مطلوب",
        path: ["nationalIdFront"],
      });
    }

    if (!data.nationalIdBack) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "مطلوب",
        path: ["nationalIdBack"],
      });
    }

    if (!data.lawyerLicense) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "مطلوب",
        path: ["lawyerLicense"],
      });
    }
  });

export type VerificationFormData = z.infer<typeof verificationSchema>;
