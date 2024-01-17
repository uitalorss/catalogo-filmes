import { createUserSchema } from './createUserSchema';

export const updateUserSchema = createUserSchema.partial();
