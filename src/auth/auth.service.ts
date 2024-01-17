import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login-dto';
import { compare } from 'bcrypt';
import { ResponseAuthDto } from './dto/response-auth-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  public async login(authLoginDto: AuthLoginDto): Promise<ResponseAuthDto> {
    const user = await this.usersService.findByEmail(authLoginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email e/ou senha estão incorretos.');
    }
    const isValidPassword = await compare(authLoginDto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email e/ou senha estão incorretos.');
    }

    const payload = { sub: user.id };

    const tokenValue = await this.jwtService.signAsync(payload);
    return {
      token: tokenValue,
    };
  }
}
