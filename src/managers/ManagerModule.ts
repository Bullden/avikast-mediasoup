import {Module} from '@nestjs/common';
import {MediasoupModule} from 'mediasoup/MediasoupModule';
import IMediasoupManager from './mediasoup/IMediasoupManager';
import MediasoupManager from './mediasoup/MediasoupManager';
import ILogger from 'utils/ILogger';
import Logger from 'utils/Logger';

@Module({
  imports: [
    //
    MediasoupModule,
  ],
  providers: [
    {
      provide: IMediasoupManager,
      useClass: MediasoupManager,
    },
    {
      provide: ILogger,
      useClass: Logger,
    },
  ],
  exports: [
    //
    IMediasoupManager,
  ],
})
export class ManagerModule {}
