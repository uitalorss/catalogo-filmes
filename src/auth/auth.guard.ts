import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class authGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token inválido');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'banana',
      });
      request['user'] = payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Sessão inválida');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
