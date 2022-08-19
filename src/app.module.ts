import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { VisitorsModule } from 'modules/visitors/visitors.module';

@Module({
  imports: [VisitorsModule, DatabaseModule],
})
export class AppModule {}
