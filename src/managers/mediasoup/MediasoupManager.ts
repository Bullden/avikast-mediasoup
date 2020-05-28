import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {Injectable} from '@nestjs/common';
import IMediasoup from 'mediasoup/IMediasoup';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }

  async createRouter() {
    const router = await this.mediasoup.createRouter();
    return {rtpCapabilities: router.rtpCapabilities};
  }

  async createTransport(transportId: string) {
    const router = await this.mediasoup.getRouterByName(transportId);
    return router.createWebRtcTransport(transportId);
  }
}
