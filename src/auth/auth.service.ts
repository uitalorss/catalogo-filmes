import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/authLogin-dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  public async login(authLoginDto: AuthLoginDto) {
    const user = await this.usersService.findByEmail(authLoginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email e/ou senha estão incorretos.');
    }
    const isValidPassword = await compare(authLoginDto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email e/ou senha estão incorretos.');
    }

    const payload = { sub: user.id };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
