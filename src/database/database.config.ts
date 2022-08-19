import { SequelizeOptions } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize-options';

import {
  MATOMO_DB_DATABASE,
  MATOMO_DB_HOST,
  MATOMO_DB_PASSWORD,
  MATOMO_DB_PORT,
  MATOMO_DB_USER,
} from 'utils/constants';

export const MatomoSequelizeDBConfig: SequelizeOptions = {
  dialect: 'mysql',
  username: MATOMO_DB_USER,
  password: MATOMO_DB_PASSWORD,
  database: MATOMO_DB_DATABASE,
  host: MATOMO_DB_HOST,
  port: MATOMO_DB_PORT,
  query: { raw: true },
  define: { timestamps: false },
};
