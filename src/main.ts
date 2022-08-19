import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { PORT } from 'utils/constants';
import Swagger from 'utils/swagger';

const bootstrap = async () => NestFactory.create(AppModule, { cors: true });

const startApp = async (app) => {
  app.use(cookieParser());

  const swagger = new Swagger(app);
  swagger.setup();

  await app.listen(PORT);

  return `Application is running on port ${PORT}`;
};

bootstrap().then(startApp).then(console.log).catch(console.error);
