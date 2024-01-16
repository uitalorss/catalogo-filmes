import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { createUserSchema } from './create-user.dto';

patchNestJsSwagger();

export const partialUserSchema = createUserSchema.partial();

export class UpdateUserDto extends createZodDto(partialUserSchema) {}
