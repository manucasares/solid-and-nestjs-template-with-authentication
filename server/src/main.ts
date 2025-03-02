import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from './resources/auth/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  setGlobalAuthGuard(app);

  await app.listen(process.env.PORT ?? 3000);
}

function setGlobalAuthGuard(app: INestApplication<any>) {
  const cacheManager = app.get<Cache>(CACHE_MANAGER);
  const reflector = app.get<Reflector>(Reflector);

  app.useGlobalGuards(new AuthGuard(cacheManager, reflector));
}

bootstrap();
