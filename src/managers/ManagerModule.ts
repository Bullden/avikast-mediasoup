import {Module} from '@nestjs/common';
import {MediasoupModule} from 'mediasoup/MediasoupModule';
import IMediasoupManager from './mediasoup/IMediasoupManager';
import MediasoupManager from './mediasoup/MediasoupManager';

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
