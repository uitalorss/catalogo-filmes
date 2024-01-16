import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, loginSchema } from './dto/authLogin-dto';
import { ZodValidationPipe } from '../helpers/ZodValidationPipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('login')
  public async login(
    @Body(new ZodValidationPipe(loginSchema)) authLoginDto: AuthLoginDto,
  ) {
    return this.authService.login(authLoginDto);
  }
}
