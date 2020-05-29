import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {Injectable} from '@nestjs/common';
import IMediasoup from 'mediasoup/IMediasoup';
import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';

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
    const transport = this.findTransportByRoomId(roomId);
    await transport.connectToRouter(dtlsParameters);
    return true;
  }

  findTransportByRoomId(roomId: string) {
    const router = this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    const transport = router.findTransportByRoomId(roomId);
    if (!transport) throw new Error(`cannot find router by roomId ${transport}`);
    return transport;
  }

  async sendTrack(
    transportId: string,
    roomId: string,
    kind: string,
    rtpParameters: RtpParameters,
  ) {
    const transport = this.findTransportByRoomId(roomId);
    return transport.createProducer(transportId, roomId, kind, rtpParameters);
  }

  async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const transport = this.findTransportByRoomId(roomId);
    return transport.createConsumer(producerId, roomId, rtpCapabilities);
  }
}
