import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfig } from './shared/config/configuration';
import { esOrigenPermitido } from './shared/config/es-origen-permitido';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = configService.get<AppConfig>('app')!;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || esOrigenPermitido(origin, config.corsOrigins)) {
        callback(null, true);
        return;
      }
      callback(new Error('No permitido por CORS'), false);
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');

  await app.listen(config.port);
}

bootstrap();
