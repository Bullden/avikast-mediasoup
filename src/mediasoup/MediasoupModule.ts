import {Module} from '@nestjs/common';
import IMediasoup from './IMediasoup';
import Mediasoup from './Mediasoup';

@Module({
  imports: [
    //
  ],
  providers: [
    {
      provide: IMediasoup,
      useFactory: () => {
        return new Mediasoup();
      },
    },
  ],
  exports: [
    //
    IMediasoup,
  ],
})
export class MediasoupModule {}
