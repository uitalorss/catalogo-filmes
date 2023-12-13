import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { FilmsModule } from './films/films.module';

@Module({
  imports: [UsersModule, DatabaseModule, FilmsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
