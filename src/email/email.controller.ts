import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendMailForgotPasswordDto } from './dto/send-mail-dto';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @HttpCode(201)
  @Post()
  public async send(@Body() { email }: SendMailForgotPasswordDto) {
    return this.emailService.sendMail({ email });
  }
}
