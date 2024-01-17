import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { z } from 'zod';

patchNestJsSwagger();

export const searchQuerySchema = z.object({
  genre: z.string().optional().nullable(),
  artist: z.string().optional().nullable(),
  contentRating: z
    .enum(['Livre', '+12', '+14', '+16', '+18'])
    .optional()
    .nullable(),
});

export class searchQueryDto extends createZodDto(searchQuerySchema) {}
