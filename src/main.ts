import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { PORT } from 'utils/constants';

const bootstrap = async () => NestFactory.create(AppModule, { cors: true });

const startApp = async (app) => {
  await app.listen(PORT);
  app.use(cookieParser());

  return `Application is running on port ${PORT}`;
};

bootstrap().then(startApp).then(console.log).catch(console.error);
