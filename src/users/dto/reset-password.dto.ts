import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { z } from 'zod';

patchNestJsSwagger();

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

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
