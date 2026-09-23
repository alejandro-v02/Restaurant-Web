import { DataSourceOptions } from 'typeorm';
import { AppConfig } from '../config/configuration';

export const ENTITIES_GLOB =
  __dirname + '/../../modules/**/*.orm-entity{.ts,.js}';
export const MIGRATIONS_GLOB = __dirname + '/migrations/*{.ts,.js}';

export function buildTypeOrmOptions(config: AppConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    entities: [ENTITIES_GLOB],
    migrations: [MIGRATIONS_GLOB],
    synchronize: false,
    logging: config.env === 'development',
  };
}
