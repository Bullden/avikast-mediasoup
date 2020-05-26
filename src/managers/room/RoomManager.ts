import IRoomManager from './IRoomManager';
import {Injectable} from '@nestjs/common';
import IMediasoup from 'mediasoup/IMediasoup';

@Injectable()
export default class RoomManager extends IRoomManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }
}
