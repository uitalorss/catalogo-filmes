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
  entities: [User],
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: ['./src/database/migrations/*.{ts, js}'],
});
