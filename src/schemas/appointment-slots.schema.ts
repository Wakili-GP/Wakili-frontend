import { z } from "zod";

export const slotSchema = z
  .object({
    startTime: z.string().min(1, "وقت البدء مطلوب"),
    endTime: z.string().min(1, "وقت الانتهاء مطلوب"),
    sessionType: z.enum(["0", "1"]),
  })
  .refine((d) => d.startTime < d.endTime, {
    message: "يجب أن يكون وقت البدء قبل وقت الانتهاء",
    path: ["endTime"],
  });

export type SlotFormValues = z.infer<typeof slotSchema>;
