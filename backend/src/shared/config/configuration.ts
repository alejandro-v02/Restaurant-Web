import { registerAs } from '@nestjs/config';

export interface AppConfig {
  env: string;
  port: number;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  redis: {
    host: string;
    port: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  facturacion: {
    proveedor: string;
    apiUrl?: string;
    apiKey?: string;
  };
  corsOrigins: string[];
}

export default registerAs(
  'app',
  (): AppConfig => ({
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      user: process.env.DB_USER ?? 'fogon',
      password: process.env.DB_PASSWORD ?? '',
      name: process.env.DB_NAME ?? 'fogon_pos',
    },
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '12h',
    },
    facturacion: {
      proveedor: process.env.FACTURACION_PROVEEDOR ?? 'simulado',
      apiUrl: process.env.FACTURACION_API_URL,
      apiKey: process.env.FACTURACION_API_KEY,
    },
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
      .split(',')
      .map((origin) => origin.trim()),
  }),
);
