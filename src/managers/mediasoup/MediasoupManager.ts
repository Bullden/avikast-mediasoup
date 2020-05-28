import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {Injectable} from '@nestjs/common';
import IMediasoup from 'mediasoup/IMediasoup';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }

  async createRouter(roomId: string) {
    const router = await this.mediasoup.createRouter(roomId);
    return {rtpCapabilities: router.rtpCapabilities};
  }

  async createTransport(roomId: string) {
    const router = await this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error('Router not found');
    return router.createWebRtcTransport(roomId);
  }
}
