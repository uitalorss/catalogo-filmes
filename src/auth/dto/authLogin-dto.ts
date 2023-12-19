import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Campo email é obrigatório' })
    .email({ message: 'informe um email válido' }),
  password: z.string({ required_error: 'Campo senha é obrigatório.' }),
});

export type AuthLoginDto = z.infer<typeof loginSchema>;
