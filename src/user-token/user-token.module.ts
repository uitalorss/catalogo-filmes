import { Module } from '@nestjs/common';
import { UserToken } from './entities/userToken.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenService } from './user-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  controllers: [],
  providers: [UserTokenService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
