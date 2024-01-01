import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { UserTokenModule } from './user-token/user-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DatabaseModule,
    FilmsModule,
    AuthModule,
    EmailModule,
    UserTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
