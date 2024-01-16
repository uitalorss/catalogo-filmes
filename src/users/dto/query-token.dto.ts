import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const queryTokenSchema = z.object({
  token: z
    .string({ required_error: 'Campo não pode ficar vazio' })
    .uuid({ message: 'Informe um token válido' }),
});

export class queryTokenDto extends createZodDto(queryTokenSchema) {
  token: string;
}
