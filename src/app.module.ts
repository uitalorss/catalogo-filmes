import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, DatabaseModule, FilmsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
