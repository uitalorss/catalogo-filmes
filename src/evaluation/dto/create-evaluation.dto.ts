import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { z } from 'zod';

patchNestJsSwagger();

export const createEvaluationSchema = z.object({
  rating: z
    .number({ required_error: 'Campo Nota é obrigatório' })
    .min(0, { message: 'Nota inválida' })
    .max(10, { message: 'Nota inválida' }),
  comment: z.string().optional(),
});

export class CreateEvaluationRequestDto extends createZodDto(
  createEvaluationSchema,
) {}

export class createEvaluationDto {
  user_id: string;
  film_id: string;
  rating: number;
  comment?: string;
}
