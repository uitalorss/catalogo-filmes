import 'dotenv/config';

import { Artist } from '../films/entities/artist.entity';
import { ContentRating } from '../films/entities/contentRating.entity';
import { Film } from '../films/entities/film.entity';
import { Genre } from '../films/entities/genre.entity';
import { UserToken } from '../user-token/entities/userToken.entity';
import { User } from '../users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Evaluation } from 'src/evaluation/entities/evaluation.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Film, Artist, Genre, ContentRating, UserToken, Evaluation],
};

export const dataSourceTest: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: Number(5429),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Film, Artist, Genre, ContentRating, UserToken],
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: ['./src/database/migrations/*.{ts, js}'],
});
