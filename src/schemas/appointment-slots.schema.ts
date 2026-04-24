import { z } from "zod";

export const searchSchema = z.object({
  searchTerm: z.string().optional(),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
