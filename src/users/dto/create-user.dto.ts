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
