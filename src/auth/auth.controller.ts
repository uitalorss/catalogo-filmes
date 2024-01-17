import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, loginSchema } from './dto/auth-login-dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/helpers/ZodValidationPipe';
import { ResponseAuthDto } from './dto/response-auth-dto';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiUnauthorizedResponse({
    description: 'Email e/ou senha estão incorretos.',
  })
  @HttpCode(201)
  @Post('login')
  public async login(
    @Res() res,
    @Body(new ZodValidationPipe(loginSchema)) authLoginDto: AuthLoginDto,
  ): Promise<ResponseAuthDto> {
    const auth = await this.authService.login(authLoginDto);
    return res.json(auth);
  }
}
