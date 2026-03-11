import { z } from "zod";

export const MAX_CONTRACT_FILE_SIZE = 2 * 1024 * 1024;

export const ACCEPTED_CONTRACT_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const contractUploadSchema = z.object({
  file: z
    .custom<File>((value) => value instanceof File, {
      message: "يرجى اختيار ملف أولاً.",
    })
    .refine(
      (file) =>
        ACCEPTED_CONTRACT_FILE_TYPES.includes(
          file.type as (typeof ACCEPTED_CONTRACT_FILE_TYPES)[number],
        ),
      {
        message: "نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word.",
      },
    )
    .refine((file) => file.size <= MAX_CONTRACT_FILE_SIZE, {
      message: "حجم الملف كبير جداً. الحد الأقصى هو 2 ميجابايت.",
    }),
});

export type ContractUploadFormValues = z.infer<typeof contractUploadSchema>;
