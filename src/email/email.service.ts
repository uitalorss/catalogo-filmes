import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
import { SendMailForgotPasswordDto } from './dto/send-mail-dto';
dotenv.config();

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  public async sendMail({ email }: SendMailForgotPasswordDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.mailerService.sendMail({
      from: `${process.env.MAIL_FROM} <${process.env.MAIL_FROM}>`,
      to: email,
      subject: 'Redefinição de senha',
      text: 'teste',
    });
  }
}
