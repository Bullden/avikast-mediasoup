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
    return this.mediasoup.createRouter(roomId);
  }

  async createTransport(roomId: string) {
    const router = await this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error('Router not found');
    return router.createWebRtcTransport(roomId);
  }

  async connectTransport(roomId: string, dtlsParameters: DtlsParameters) {
    const transport = this.findTransportByRoomId(roomId);
    if (!transport) throw new Error('Transport not found');
    await transport.connectToRouter(dtlsParameters);
  }

  findTransportByRoomId(roomId: string) {
    const router = this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    return router.findTransportByRoomId(roomId);
  }

  async sendTrack(
    transportId: string,
    roomId: string,
    kind: string,
    rtpParameters: RtpParameters,
  ) {
    const transport = this.findTransportByRoomId(roomId);
    if (!transport) throw new Error('Transport not found');
    return transport.createProducer(transportId, roomId, kind, rtpParameters);
  }

  async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const transport = this.findTransportByRoomId(roomId);
    if (!transport) throw new Error('Transport not found');
    return transport.createConsumer(producerId, roomId, rtpCapabilities);
  }

  async findProducerByRoomId(roomId: string) {
    const transport = this.findTransportByRoomId(roomId);
    if (!transport) throw new Error('Transport not found');
    return transport.findProducerByRoomId(roomId);
  }

  async findRouterByRoomId(roomId: string) {
    const router = this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error(`cannot find router by roomId ${router}`);
    return router;
  }
}
