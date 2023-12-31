import { createUserSchema } from './create-user.dto';
import { z } from 'zod';

export const partialUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof partialUserSchema>;
