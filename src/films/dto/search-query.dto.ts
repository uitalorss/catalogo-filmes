import { z } from 'zod';

export const searchQuerySchema = z.object({
  genre: z
    .string()
    .optional()
    .transform((content) => content ?? 'item'),
  artist: z
    .string()
    .optional()
    .transform((content) => content ?? 'item'),
  contentRating: z
    .string()
    .optional()
    .transform((content) => content ?? 'item'),
});

export type searchQueryDto = z.infer<typeof searchQuerySchema>;
