import { createFilmSchema } from './create-film.dto';
import { z } from 'zod';

export const partialFilmSchema = createFilmSchema.partial();

export type UpdateFilmDTO = z.infer<typeof partialFilmSchema>;
