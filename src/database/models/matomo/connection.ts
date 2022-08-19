import { Sequelize } from 'sequelize-typescript';
import { MatomoUser } from 'model/matomo/user';

import { MatomoSequelizeDBConfig } from 'src/database/database.config';

export const sequelizeMatomo = new Sequelize(MatomoSequelizeDBConfig);
sequelizeMatomo.addModels([MatomoUser]);

export const connectMatomo = async () => {
  await sequelizeMatomo.sync();
};

export const isMatomoConnected = async () => {
  try {
    await sequelizeMatomo.authenticate();

    return true;
  } catch (e) {
    return false;
  }
};

export const MatomoQuery = async (sql: string, shouldReturnArray = true): Promise<any> => {
  const [data] = await sequelizeMatomo.query(sql, {
    type: shouldReturnArray ? 'RAW' : 'SELECT',
  });

  return data;
};
