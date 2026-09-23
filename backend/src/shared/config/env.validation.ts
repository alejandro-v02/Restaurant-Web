import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('12h'),

  FACTURACION_PROVEEDOR: Joi.string().default('simulado'),
  FACTURACION_API_URL: Joi.string().allow('').optional(),
  FACTURACION_API_KEY: Joi.string().allow('').optional(),

  CORS_ORIGINS: Joi.string().default('http://localhost:4200'),
});
