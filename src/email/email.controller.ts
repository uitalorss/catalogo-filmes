import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import {
  SendMailForgotPasswordDto,
  sendMailForgotPasswordSchema,
} from './dto/send-mail-dto';
import { ZodValidationPipe } from '../helpers/ZodValidationPipe';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @ApiNotFoundResponse({ description: 'Usuário não encontrado.' })
  @HttpCode(201)
  @Post()
  public async send(
    @Body(new ZodValidationPipe(sendMailForgotPasswordSchema))
    { email }: SendMailForgotPasswordDto,
  ) {
    return this.emailService.sendMail({ email });
  }
}
