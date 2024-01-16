import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodEffects, ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any> | ZodEffects<ZodObject<any>>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      const { message } = error.issues[0];
      console.log(message);
      throw new BadRequestException({ message: message });
    }
    return value;
  }
}
