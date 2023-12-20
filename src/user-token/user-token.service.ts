import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserToken } from './entities/userToken.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  public async generateToken(id: string) {
    const userToken = this.userTokenRepository.create({ user_id: id });
    return await this.userTokenRepository.save(userToken);
  }

  public async findByToken(token: string) {
    const userToken = this.userTokenRepository.findOneBy({ token });
    return userToken;
  }
}
