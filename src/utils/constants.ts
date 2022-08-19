import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;

export const MATOMO_DB_USER = process.env.MATOMO_DB_USER;
export const MATOMO_DB_PASSWORD = process.env.MATOMO_DB_PASSWORD;
export const MATOMO_DB_DATABASE = process.env.MATOMO_DB_DATABASE;
export const MATOMO_DB_HOST = process.env.MATOMO_DB_HOST;
export const MATOMO_DB_PORT = Number(process.env.MATOMO_DB_PORT) || 3306;
