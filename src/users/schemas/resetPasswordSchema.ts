import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z.string({ required_error: 'Campo não pode ficar vazio.' }),
    confirmPassword: z.string({
      required_error: 'Campo não pode ficar vazio.',
    }),
  })
  .refine((item) => item.password === item.confirmPassword, {
    message: 'As senhas não coincidem',
  });
