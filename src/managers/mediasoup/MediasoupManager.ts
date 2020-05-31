import {Injectable} from '@nestjs/common';
import IMediasoupManager from './IMediasoupManager';
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

  async createTransport(roomId: string, direction: 'send' | 'receive') {
    const router = await this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error('Router not found');
    return router.createWebRtcTransport(roomId, direction);
  }

  async connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
    direction: 'send' | 'receive',
  ) {
    const transport = this.findTransportByRoomId(roomId, direction);
    if (!transport) throw new Error('Transport not found');
    await transport.connectToRouter(dtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    const router = this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    return router.findTransportByRoomId(roomId, direction);
  }

  async createProducer(
    transportId: string,
    roomId: string,
    rtpParameters: RtpParameters,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'send'); // todo: refactor
    if (!transport) throw new Error('Transport not found');
    return transport.createProducer(transportId, roomId, rtpParameters);
  }

  async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'receive'); // todo: refactor
    if (!transport) throw new Error('Transport not found');
    return transport.createConsumer(producerId, roomId, rtpCapabilities);
  }

  async findRouterByRoomId(roomId: string) {
    const router = this.mediasoup.findRouterByRoomId(roomId);
    if (!router) throw new Error(`cannot find router by roomId ${router}`);
    return router;
  }
}
