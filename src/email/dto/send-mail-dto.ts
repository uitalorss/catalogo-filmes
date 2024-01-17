import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { z } from 'zod';

patchNestJsSwagger();

export const sendMailForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Campo email é obrigatório' })
    .email({ message: 'informe um email válido' }),
});

export class SendMailForgotPasswordDto extends createZodDto(
  sendMailForgotPasswordSchema,
) {}
