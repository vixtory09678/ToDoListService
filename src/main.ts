import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*'
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use('/images', express.static(`${__dirname}/uploads`))

  const config = app.get(ConfigService);
  const port = config.get<number>('APP_PORT', 3000);
  await app.listen(port);
}
bootstrap();
