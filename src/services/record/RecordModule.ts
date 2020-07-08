import {Module} from '@nestjs/common';
import {ConfigModule} from '../config/ConfigModule';
import IRecordService from 'services/record/IRecordSevice';
import RecordService from 'services/record/RecordService';

@Module({
  imports: [
    //
    ConfigModule,
  ],
  providers: [
    {
      provide: IRecordService,
      useClass: RecordService,
    },
  ],
  exports: [IRecordService],
})
export class RecordModule {}
