import {Injectable} from '@nestjs/common';
import IMediasoupManager from './IMediasoupManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {MediaKind, MediaType, ProducerOptions} from 'entities/Mediasoup';
import {types} from 'mediasoup';
import ILogger from 'utils/ILogger';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup, private readonly logger: ILogger) {
    super();
  }

  async createRouter(roomId: string) {
    const router = await this.mediasoup.createRouter({roomId});
    this.logger.routerLog('router created with roomId:', router.roomId);
    return router;
  }

  async createTransport(
    roomId: string,
    userId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    let router = await this.mediasoup.findRouter({roomId});
    if (!router) {
      router = await this.mediasoup.createRouter({roomId});
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
    this.logger.transportLog('transport connected', transport.id);
    await transport.connectToRouter(dtlsParameters as types.DtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    const router = this.mediasoup.findRouter({roomId});
    this.logger.transportLog('find transport by room id', roomId);
    if (!router) {
      throw new Error(`findTransportByRoomId cannot find router by roomId ${roomId}`);
    }
    this.logger.transportLog('transport founded', direction);
    return router.findTransport({roomId, direction});
  }

  findTransport(roomId: string, direction: 'send' | 'receive', clientId: string) {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`findTransport cannot find router by roomId ${roomId}`);
    const transport = router.findTransport({
      roomId,
      direction,
      clientId,
    });
    this.logger.transportLog('find transport by room id and client id:', roomId);
    return transport;
  }

  async createProducer(
    roomId: string,
    transportId: string,
    clientId: string,
    userId: string,
    rtpParameters: RtpParameters,
    mediaType: MediaType,
    mediaKind: MediaKind,
  ) {
    const transport = this.findTransport(roomId, 'send', clientId); // todo: refactor
    if (!transport)
      throw new Error(
        `No transport By roomId ${roomId} direction send and clientid ${clientId}`,
      );
    const producer = await transport.createProducer(
      transportId,
      rtpParameters,
      mediaKind,
      {
        roomId,
        clientId,
        userId,
        mediaType,
      },
    );
    this.logger.producerLog('producer created', producer.id);
    return producer;
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

    const consumer = await transport.createConsumer(producerId, rtpCapabilities, {
      roomId,
      clientId,
      userId,
    });
    this.logger.consumerLog('consumer created', consumer.id);
    return consumer;
  }

  async findRouter(roomId: string) {
    let router = this.mediasoup.findRouter({roomId});
    if (!router) router = await this.mediasoup.createRouter({roomId});
    return router;
  }

  async findProducer(roomId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'send');
    if (!transport) throw new Error(`cannot find transport by transport ${transport}`);
    const producer = transport.findProducer({roomId});
    if (!producer) throw new Error(`cannot find producer by userId ${userId}`);
    this.logger.producerLog('producer found', producer.id);
    return producer;
  }

  async getProducers(roomId: string) {
    const router = await this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${router}`);
    const transports = router.getTransports();
    const producers: ProducerOptions[] = [];
    this.logger.producerLog('get producers by roomid:', roomId);
    transports
      .filter((t) => t.dtlsState === 'connected')
      .forEach((transport) => {
        producers.push(...transport.producers);
      });
    this.logger.producerLog('result producers array length:', roomId);
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
