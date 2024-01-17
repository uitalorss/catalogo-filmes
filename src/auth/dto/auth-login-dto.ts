import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { z } from 'zod';

patchNestJsSwagger();

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo email é obrigatório' })
    .email({ message: 'informe um email válido' }),
  password: z.string({ required_error: 'Campo senha é obrigatório.' }),
});

export class AuthLoginDto extends createZodDto(loginSchema) {}
