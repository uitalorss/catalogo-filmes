import * as dotenv from 'dotenv';

import { Artist } from 'src/films/entities/artist.entity';
import { ContentRating } from 'src/films/entities/contentRating.entity';
import { Film } from 'src/films/entities/film.entity';
import { Genre } from 'src/films/entities/genre.entity';
import { UserToken } from 'src/user-token/entities/userToken.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Film, Artist, Genre, ContentRating, UserToken],
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: ['./src/database/migrations/*.{ts, js}'],
});
