import { Artist } from 'src/films/entities/artist.entity';
import { ContentRating } from 'src/films/entities/contentRating.entity';
import { Film } from 'src/films/entities/film.entity';
import { Genre } from 'src/films/entities/genre.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5431,
  username: 'postgres',
  password: 'postgres',
  database: 'catalogofilmes',
  synchronize: false,
  entities: [User, Film, Artist, Genre, ContentRating],
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: ['./src/database/migrations/*.{ts, js}'],
});
