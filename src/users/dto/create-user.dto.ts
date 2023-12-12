import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Campo nome é obrigatório' })
    .trim()
    .min(1, 'Campo nome não pode ficar vazio.'),
  email: z
    .string({ required_error: 'Campo email é obrigatório' })
    .email('Favor informar um email válido'),
  password: z
    .string({ required_error: 'campo senha é obrigatório' })
    .min(5, 'Favor informar uma senha maior')
    .max(20, 'Favor informar uma senha menor'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
