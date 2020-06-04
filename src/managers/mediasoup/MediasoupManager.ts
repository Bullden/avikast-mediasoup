import {Injectable} from '@nestjs/common';
import IMediasoupManager from './IMediasoupManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import Producer from 'mediasoup/Producer';
import {ProducerOptions} from 'entities/Mediasoup';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }

  async createRouter(roomId: string) {
    return this.mediasoup.createRouter({roomId});
  }

  async createTransport(
    roomId: string,
    userId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    const router = await this.mediasoup.findRouter({roomId});
    console.log('createTransport', router, roomId);
    const transport = this.findTransport(roomId, direction, clientId);
    console.log(roomId, direction, clientId, 'transport');
    // if (transport) throw new Error(`Transport by client id ${clientId} already created`);
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
    console.log(roomId, 'ROOM ID FOR SEARCH');
    // const transport = this.findTransport(roomId, direction, clientId);
    const router = await this.findRouter(roomId);
    const transport = router.findTransport({roomId, direction});
    if (!transport) throw new Error(`'Transport not found', ${transport}`);
    await transport.connectToRouter(dtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    console.log('findTransport By RoomId ROOOM ID ', roomId);
    const router = this.mediasoup.findRouter({roomId});
    if (!router) {
      throw new Error(`findTransportByRoomId cannot find router by roomId ${roomId}`);
    }
    return router.findTransport({roomId, direction});
  }

  findTransport(roomId: string, direction: 'send' | 'receive', clientId: string) {
    console.log('find transport ROOOM ID ', roomId);
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`findTransport cannot find router by roomId ${roomId}`);
    return router.findTransport({
      roomId,
      direction,
      clientId,
    });
  }

  async createProducer(
    roomId: string,
    transportId: string,
    clientId: string,
    userId: string,
    rtpParameters: RtpParameters,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'send'); // todo: refactor
    if (!transport) throw new Error('Transport not found');
    // const producer = this.findProducer(roomId, userId);
    // if (producer) return producer;
    return transport.createProducer(transportId, rtpParameters, {
      roomId,
      clientId,
      userId,
    });
  }

  async createConsumer(
    roomId: string,

    producerId: string,
    rtpCapabilities: RtpCapabilities,
    clientId: string,
    userId: string,
  ) {
    const transport = this.findTransportByRoomId(roomId, 'receive');
    if (!transport) throw new Error('Transport not found');
    const consumer = this.findConsumer(roomId, userId, userId);
    if (consumer) return consumer;
    return transport.createConsumer(producerId, rtpCapabilities, {
      roomId,
      clientId,
      userId,
    });
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
    if (!producer) throw new Error(`cannot find producer by userId ${userId}`);
    return producer;
  }

  async getProducers(roomId: string) {
    const router = await this.findRouter(roomId);
    const transports = router.getTransports();
    const producers: ProducerOptions[] = [];
    transports.forEach((transport) => producers.push(...transport.producers));
    if (!producers) throw new Error(`cno producer onthis router.roomId ${router.roomId}`);
    return producers;
  }

  async findConsumer(roomId: string, clientId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'receive');
    if (!transport) throw new Error(`cannot find transport by transport ${transport}`);
    const consumer = transport.findConsumer({userId, clientId, roomId});
    if (!consumer) throw new Error(`cannot find consumer by clientId ${clientId}`);
    return consumer;
  }
}
