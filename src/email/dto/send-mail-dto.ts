import { z } from 'zod';

export const sendMailForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Campo email é obrigatório' })
    .email({ message: 'informe um email válido' }),
});

export type SendMailForgotPasswordDto = z.infer<
  typeof sendMailForgotPasswordSchema
>;
