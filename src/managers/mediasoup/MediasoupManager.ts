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
    return this.mediasoup.createRouter({roomId});
  }

  async createTransport(roomId: string, direction: 'send' | 'receive', clientId: string) {
    const router = await this.mediasoup.findRouter({roomId});
    if (!router) throw new Error('Router not found');
    return router.createWebRtcTransport({
      roomId,
      direction,
      clientId,
    });
  }

  async connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    const transport = this.findTransport(roomId, direction, clientId);
    if (!transport) throw new Error('Transport not found');
    await transport.connectToRouter(dtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    return router.findTransport({roomId, direction});
  }

  findTransport(roomId: string, direction: 'send' | 'receive', clientId: string) {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${roomId}`);
    return router.findTransport({
      roomId,
      direction,
      clientId,
    });
  }

  async createProducer(
    transportId: string,
    roomId: string,
    clientId: string,
    rtpParameters: RtpParameters,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'send'); // todo: refactor
    if (!transport) throw new Error('Transport not found');
    return transport.createProducer(transportId, rtpParameters, {
      roomId,
      clientId,
    });
  }

  async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
    clientId: string,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'receive');
    if (!transport) throw new Error('Transport not found');
    return transport.createConsumer(producerId, rtpCapabilities, {roomId, clientId});
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
