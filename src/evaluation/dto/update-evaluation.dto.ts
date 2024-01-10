import { z } from 'zod';
import { createEvaluationSchema } from './create-evaluation.dto';

export const partialEvaluationSchema = createEvaluationSchema.partial();

export type updateEvaluationRequest = z.infer<typeof partialEvaluationSchema>;

export type updateEvaluationDto = {
  user_id: string;
  evaluation_id: string;
  rating?: number;
  comment?: string;
};
