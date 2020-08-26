import {Module} from '@nestjs/common';
import {ConfigModule} from '../config/ConfigModule';
import IRecordService from 'services/record/IRecordSevice';
import RecordService from 'services/record/RecordService';
import {IConfigService} from '@spryrocks/config-node';
import * as fs from 'fs';
import ILogger from 'utils/ILogger';

@Module({
  imports: [
    //
    ConfigModule,
  ],
  providers: [
    {
      inject: [IConfigService, ILogger],
      provide: IRecordService,
      useFactory: (configService: IConfigService, logger: ILogger) => {
        const rootDirectory = configService.get('RECORDINGS_ROOT_DIRECTORY');
        if (!fs.existsSync(rootDirectory))
          throw new Error(`Recordings directory not exists at '${rootDirectory}'`);
        return new RecordService(rootDirectory, logger);
      },
    },
  ],
  exports: [IRecordService],
})
export class RecordModule {}
