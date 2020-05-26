import {Controller} from '@nestjs/common';
import IRoomManager from '../managers/room/IRoomManager';
import {MessagePattern} from './MessagePattern';
import {CreateRoomRequest} from 'api/entities/CreateRoomRequest';

@Controller()
export default class MediasoupController {
  constructor(private readonly roomManager: IRoomManager) {}

  @MessagePattern({area: 'room', action: 'create'})
  createRoom(request: CreateRoomRequest) {
    // eslint-disable-next-line no-console
    console.log(request);
    return this.roomManager.createRoom();
  }
}
