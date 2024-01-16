import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Campo nome é obrigatório' })
    .trim()
    .min(1, 'Campo nome não pode ficar vazio.')
    .openapi({ example: 'test' }),
  email: z
    .string({ required_error: 'Campo email é obrigatório' })
    .email('Favor informar um email válido')
    .openapi({ example: 'test@test.com' }),
  password: z
    .string({ required_error: 'campo senha é obrigatório' })
    .min(5, 'Favor informar uma senha maior')
    .max(20, 'Favor informar uma senha menor')
    .openapi({ example: '123456' }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
