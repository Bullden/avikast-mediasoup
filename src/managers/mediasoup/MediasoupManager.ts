import {Injectable} from '@nestjs/common';
import IMediasoupManager from './IMediasoupManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {MediaAttributes} from 'entities/Mediasoup';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }

  async createRouter(roomId: string) {
    return this.mediasoup.createRouter(roomId);
  }

  async createTransport(roomId: string, mediaAttributes: MediaAttributes) {
    const router = await this.mediasoup.findRouter({roomId});
    if (!router) throw new Error('Router not found');
    return router.createWebRtcTransport(roomId, mediaAttributes);
  }

  async connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
    mediaAttributes: MediaAttributes,
  ) {
    const transport = this.findTransport(roomId, mediaAttributes);
    if (!transport) throw new Error('Transport not found');
    await transport.connectToRouter(dtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    return router.findTransport({roomId, direction});
  }

  findTransport(roomId: string, {direction, kind, mediaType}: MediaAttributes) {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    return router.findTransport({
      roomId,
      direction,
      kind,
      mediaType,
    });
  }

  async createProducer(
    transportId: string,
    roomId: string,
    userId: string,
    rtpParameters: RtpParameters,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'send'); // todo: refactor
    if (!transport) throw new Error('Transport not found');
    return transport.createProducer(transportId, {roomId, userId}, rtpParameters);
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

  async findRouter(roomId: string) {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${router}`);
    return router;
  }

  async findProducer(roomId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'send');
    if (!transport) throw new Error(`cannot find transport by transport ${transport}`);
    const producer = transport.findProducer({userId, roomId});
    if (!producer) throw new Error(`cannot find producer by producer ${producer}`);
    return producer;
  }
}
