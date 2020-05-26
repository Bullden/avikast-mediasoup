import {Module} from '@nestjs/common';
import IMediasoup from './IMediasoup';
import {initializeMediasoup} from './MediasoupInitializer';

@Module({
  imports: [
    //
  ],
  providers: [
    {
      provide: IMediasoup,
      useFactory: () => {
        return initializeMediasoup();
      },
    },
  ],
  exports: [
    //
    IMediasoup,
  ],
})
export class MediasoupModule {}
