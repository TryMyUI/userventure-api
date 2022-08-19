import { connectMatomo, isMatomoConnected, sequelizeMatomo } from 'model/matomo/connection';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const isConnected = await isMatomoConnected();
      if (!isConnected) {
        await connectMatomo();
      }

      return sequelizeMatomo;
    },
  },
];
