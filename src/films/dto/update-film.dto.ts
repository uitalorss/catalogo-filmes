import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { createFilmSchema } from './create-film.dto';

patchNestJsSwagger();

export const partialFilmSchema = createFilmSchema.partial();

export class UpdateFilmDTO extends createZodDto(partialFilmSchema) {}
