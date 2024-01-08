import { z } from 'zod';

export const searchQuerySchema = z.object({
  genre: z.string().optional().nullable(),
  artist: z.string().optional().nullable(),
  contentRating: z
    .enum(['Livre', '+12', '+14', '+16', '+18'])
    .optional()
    .nullable(),
});

export type searchQueryDto = z.infer<typeof searchQuerySchema>;
