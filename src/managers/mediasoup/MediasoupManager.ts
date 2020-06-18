import {Injectable} from '@nestjs/common';
import IMediasoupManager from './IMediasoupManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {MediaKind, MediaType, ProducerOptions} from 'entities/Mediasoup';
import {types} from 'mediasoup';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }

  async createRouter(roomId: string) {
    const router =  await this.mediasoup.createRouter({roomId});
    console.log(router)
    return router
  }

  async createTransport(
    roomId: string,
    userId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    let router = await this.mediasoup.findRouter({roomId});
    if (!router){
      router = await this.mediasoup.createRouter({roomId})
    }
    return router.createWebRtcTransport({
      roomId,
      userId,
      direction,
      clientId,
    });
  }

  async connectTransport(
    roomId: string,
    dtlsParameters: object,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    const router = await this.findRouter(roomId);
    const transport = router.findTransport({roomId, direction, clientId});
    if (!transport) throw new Error(`'Transport not found', ${transport}`);
    console.log('TRANSPORT CONNECTED ID', transport.id);
    await transport.connectToRouter(dtlsParameters as types.DtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) {
      throw new Error(`findTransportByRoomId cannot find router by roomId ${roomId}`);
    }
    return router.findTransport({roomId, direction});
  }

  findTransport(roomId: string, direction: 'send' | 'receive', clientId: string) {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`findTransport cannot find router by roomId ${roomId}`);
    console.log('find transport');
    const transport = router.findTransport({
      roomId,
      direction,
      clientId,
    });
    console.log('transport found');
    return transport;
  }

  async createProducer(
    roomId: string,
    transportId: string,
    clientId: string,
    userId: string,
    rtpParameters: RtpParameters,
    mediaType: MediaType,
    mediaKind: MediaKind
  ) {
    const transport = this.findTransport(roomId, 'send', clientId); // todo: refactor
    if (!transport)
      throw new Error(
        `No transport By roomId ${roomId} direction send and clientid ${clientId}`,
      );
    const producer = await transport.createProducer(transportId, rtpParameters,mediaKind, {
      roomId,
      clientId,
      userId,
      mediaType
    });
    const producerOptions = producer
    console.log('producer created', producerOptions.id)

    return producerOptions
  }

  async createConsumer(
    roomId: string,
    producerId: string,
    rtpCapabilities: RtpCapabilities,
    clientId: string,
    userId: string,
  ) {
    const transport = this.findTransport(roomId, 'receive', clientId);
    if (!transport)
      throw new Error(`By roomId ${roomId} direction receive and clientid ${clientId}`);

    return transport.createConsumer(producerId, rtpCapabilities, {
      roomId,
      clientId,
      userId,
    });
  }

  async findRouter(roomId: string) {
    let router = this.mediasoup.findRouter({roomId});
    if(!router) router = await this.mediasoup.createRouter({roomId})
    return router;
  }

  async findProducer(roomId: string,  userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'send');
    if (!transport) throw new Error(`cannot find transport by transport ${transport}`);
    const producer = transport.findProducer({roomId});
    if (!producer) throw new Error(`cannot find producer by userId ${userId}`);
    console.log('find producers')
    return producer;
  }

  async getProducers(roomId: string) {
    const router = await this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${router}`);
    const transports = router.getTransports();
    const producers: ProducerOptions[] = [];
    console.log(`get producers with room id ${roomId}`);
    transports
      .filter((t) => t.dtlsState === 'connected')
      .forEach((transport) => {
        producers.push(...transport.producers);
      });
    console.log('result producers array', producers.length)
    if (!producers) throw new Error(`no producer on this router.roomId ${router.roomId}`);
    return producers;
  }

  async findConsumer(roomId: string, clientId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'receive');
    if (!transport)
      throw new Error(`Consumer:cannot find transport by transport ${transport}`);
    const consumer = transport.findConsumer({userId, clientId, roomId});
    if (!consumer)
      throw new Error(`COnsumer: cannot find consumer by clientId ${clientId}`);
    return consumer;
  }
}
