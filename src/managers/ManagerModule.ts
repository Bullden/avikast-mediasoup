import {Module} from '@nestjs/common';
import {MediasoupModule} from '../mediasoup/MediasoupModule';
import IRoomManager from './room/IRoomManager';
import RoomManager from './room/RoomManager';

@Module({
  imports: [
    //
    MediasoupModule,
  ],
  providers: [
    {
      provide: IRoomManager,
      useClass: RoomManager,
    },
  ],
  exports: [
    //
    IRoomManager,
  ],
})
export class ManagerModule {}
