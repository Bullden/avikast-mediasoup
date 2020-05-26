import {Module} from '@nestjs/common';
import {MediasoupModule} from 'mediasoup/MediasoupModule';
import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import MediasoupManager from 'managers/mediasoup/MediasoupManager';

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
  ],
  exports: [
    //
    IMediasoupManager,
  ],
})
export class ManagerModule {}
