import { z } from 'zod';

export const resetPasswordSchema = z.object({
  password: z.string({ required_error: 'Campo não pode ficar vazio.' }),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
