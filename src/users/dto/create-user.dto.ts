<<<<<<< HEAD
import { createZodDto, patchNestJsSwagger } from 'nestjs-zod';
import { z } from 'zod';

patchNestJsSwagger();

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

export class CreateUserDto extends createZodDto(createUserSchema) {}
=======
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'Nome completo do usuário' })
  name: string;
  @IsString()
  @IsEmail()
  @ApiProperty({ description: 'Email do usuário' })
  email: string;
  @IsString()
  @ApiProperty({ description: 'Senha para autenticação do usuário' })
  password: string;
}
>>>>>>> conflict
