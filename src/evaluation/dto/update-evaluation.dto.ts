import { createEvaluationSchema } from './create-evaluation.dto';
import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';

patchNestJsSwagger();

export const partialEvaluationSchema = createEvaluationSchema.partial();

export class updateEvaluationRequest extends createZodDto(
  partialEvaluationSchema,
) {}

export class updateEvaluationDto {
  user_id: string;
  evaluation_id: string;
  rating?: number;
  comment?: string;
}
