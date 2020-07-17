/* eslint-disable no-console */
import {Injectable} from '@nestjs/common';
import IMediaManager from 'managers/media/IMediaManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {MediaKind, MediaType, ProducerOptions} from 'entities/Mediasoup';
import {types} from 'mediasoup';
import ILogger from 'utils/ILogger';
import IRecordService from 'services/record/IRecordSevice';
import {IConfigService} from '@spryrocks/config-node';
import WebRtcTransport from 'mediasoup/WebRtcTransport';

@Injectable()
export default class MediaManager extends IMediaManager {
  constructor(
    private readonly mediasoup: IMediasoup,
    private readonly logger: ILogger,
    private readonly recordService: IRecordService,
    private readonly configService: IConfigService,
  ) {
    super();
    // eslint-disable-next-line global-require
  }

  async createRouter(roomId: string) {
    const router = await this.mediasoup.createRouter({roomId});
    this.logger.routerLog('router created with roomId:', router.roomId);
    console.log();
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
    this.logger.transportLog('router created with roomId:', router.roomId);
    return router.createWebRtcTransport({
      roomId,
      userId,
      direction,
      clientId,
    });
  }

  async createPlainTransport(
    roomId: string,
    userId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    let router = await this.mediasoup.findRouter({roomId});
    if (!router) {
      router = await this.mediasoup.createRouter({roomId});
    }
    const transport = await router.createPlainTransport(
      {
        roomId,
        userId,
        direction,
        clientId,
      },
      this.configService,
    );
    return transport;
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
    if (!(transport instanceof WebRtcTransport)) {
      throw new Error('transport type should be WebRtc');
    }
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
    if (!(transport instanceof WebRtcTransport)) {
      throw new Error('transport type should be WebRtc');
    }
    const consumer = await transport.createConsumer(producerId, rtpCapabilities, {
      roomId,
      clientId,
      userId,
    });
    this.logger.consumerLog('consumer created', consumer.id);
    console.log('consumer created', consumer);
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
      .filter((t) => t instanceof WebRtcTransport && t.dtlsState === 'connected')
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

  // eslint-disable-next-line class-methods-use-this
  async startRecording(
    roomId: string,
    userId: string,
    recordId: string,
    producerId?: string,
    audioProducerId?: string,
  ) {
    console.log(producerId, 'producerId MANAGER');
    console.log(audioProducerId, 'audioProducerId MANAGER');
    console.log(
      `start recording, roomId ${roomId},userId ${userId}, producer id: ${producerId}, `,
    );
    const router = await this.findRouter(roomId);
    router.rtpCapabilities.codecs?.find((c) => c.mimeType === 'video/H264');
    if (producerId) {
      const producerIdTransport = await router.createPlainTransport(
        {
          roomId,
          userId,
        },
        this.configService,
      );
      await producerIdTransport.connect('127.0.0.1', 5006, 5007);
      console.log('producerId', producerId);
      console.log('audioProducerId', audioProducerId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const videoConsumer = await producerIdTransport.createConsumer(
        producerId,
        router.rtpCapabilities,
        {roomId, userId},
      );
      producerIdTransport.transport.on('connect', () => {
        console.log('audio transport connect');
      });
    }
    if (audioProducerId) {
      const audioTransport = await router.createPlainTransport(
        {
          roomId,
          userId,
        },
        this.configService,
      );
      await audioTransport.connect('127.0.0.1', 5004, 5005);
      console.log('producerId', producerId);
      console.log('audioProducerId', audioProducerId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const audioConsumer = await audioTransport.createConsumer(
        audioProducerId,
        router.rtpCapabilities,
        {roomId, userId},
      );
      audioTransport.transport.on('connect', () => {
        console.log('audio transport connect');
      });
    }

    return this.recordService.startRecording(roomId, recordId);
    // return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async stopRecording(
    roomId: string,
    userId: string,
    producerId?: string,
    audioProducerId?: string,
  ) {
    console.log(userId, producerId, audioProducerId, 'stop record');
    return this.recordService.stopRecording(roomId);
  }

  async leaveRoom(roomId: string, userId: string) {
    const router = await this.findRouter(roomId);
    if (!router) throw new Error(`leaveRoom: router not been found, room Id: ${roomId}`);
    const recvTransport = router.findTransport({userId, direction: 'receive'});
    const sendTransport = router.findTransport({userId, direction: 'send'});
    if (!recvTransport || !sendTransport)
      throw new Error(`leaveRoom: router not been found, user Id: ${roomId}`);
    if (recvTransport !== undefined) {
      recvTransport.close();
    }
    if (sendTransport !== undefined) {
      sendTransport.close();
    }
    return true;
  }

  async closeRouter(roomId: string) {
    const router = await this.findRouter(roomId);
    console.log('close room router', router);
    const transports = router.findTransports({});
    console.log('close room transports', transports);
    transports.forEach((transport) => {
      const producers = transport.findProducers({});
      producers.forEach((producer) => {
        producer.close();
        console.log('close room producer iteration', producer.id);
      });
      transport.close();
    });
    return router.close();
  }
}
