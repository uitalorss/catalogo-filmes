import { z } from 'zod';

export const queryTokenSchema = z.object({
  token: z
    .string({ required_error: 'Campo não pode ficar vazio' })
    .uuid({ message: 'Informe um token válido' }),
});

export type queryTokenDto = z.infer<typeof queryTokenSchema>;
