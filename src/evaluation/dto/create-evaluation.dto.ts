import { z } from 'zod';

export const createEvaluationSchema = z.object({
  rating: z
    .number({ required_error: 'Campo Nota é obrigatório' })
    .min(0, { message: 'Nota inválida' })
    .max(10, { message: 'Nota inválida' }),
  comment: z.string().optional(),
});

export type CreateEvaluationRequest = z.infer<typeof createEvaluationSchema>;

export type createEvaluationDto = {
  user_id: string;
  film_id: string;
  rating: number;
  comment?: string;
};
