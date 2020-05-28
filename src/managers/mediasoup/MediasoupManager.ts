import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {Injectable} from '@nestjs/common';
import IMediasoup from 'mediasoup/IMediasoup';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';

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

  async connectTransport(roomId: string, dtlsParameters: DtlsParameters) {
    const router = await this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    const transport = await router.findTransportByRoomId(roomId);
    if (!transport) throw new Error(`cannot find router by roomId ${transport}`);
    await transport.connectToRouter(dtlsParameters);
    return true;
  }
}
