import { z } from 'zod';

export const searchQuerySchema = z.object({
  genre: z.string().optional().nullable(),
  artist: z.string().optional().nullable(),
  contentRating: z.string().optional().nullable(),
});

export type searchQueryDto = z.infer<typeof searchQuerySchema>;
