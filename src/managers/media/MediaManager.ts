/* eslint-disable no-console */
import {Injectable} from '@nestjs/common';
import IMediaManager from 'managers/media/IMediaManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {MediaKind, MediaType, MuteAction, ProducerOptions} from 'entities/Mediasoup';
import {types} from 'mediasoup';
import ILogger from 'utils/ILogger';
import IRecordService from 'services/record/IRecordSevice';
import {IConfigService} from '@spryrocks/config-node';
import WebRtcTransport from 'mediasoup/WebRtcTransport';
import Producer from 'mediasoup/Producer';

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
    this.logger.transportLog('transport created with roomId:', router.roomId);
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
    if (!router)
      throw new Error(
        `findTransport cannot find router by roomId ${roomId}/${direction}`,
      );
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

  async findProducerById(roomId: string, producerId: string) {
    const transport = this.findTransportByRoomId(roomId, 'send');
    if (!transport) throw new Error(`cannot find transport by roomId ${roomId}`);
    const producer = transport.findProducerById(producerId);
    if (!producer) throw new Error(`cannot find producer by producerId ${producerId}`);
    this.logger.producerLog('producer found', producer.id);
    return producer;
  }

  async findAllProducersByUserId(roomId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'send');
    if (!transport) throw new Error(`cannot find transport by transport ${transport}`);
    const producers = transport.getProducers;
    const userProducers = producers.filter((element: Producer) => {
      return element.appData.userId === userId;
    });
    if (!userProducers) throw new Error(`cannot find producer by userId ${userId}`);
    return userProducers;
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const videoConsumer = await producerIdTransport.createConsumer(
        producerId,
        router.rtpCapabilities,
        {roomId, userId},
      );
      producerIdTransport.transport.on('connect', () => {
        this.logger.log('audio transport connect');
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
      const audioConsumer = await audioTransport.createConsumer(
        audioProducerId,
        router.rtpCapabilities,
        {roomId, userId},
      );
      audioTransport.transport.on('connect', () => {
        this.logger.consumerLog('audio transport connect', audioConsumer.id);
      });
    }

    return this.recordService.startRecording(roomId, recordId);
    // return true;
  }

  // eslint-disable-next-line class-methods-use-this
  async stopRecording(roomId: string) {
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
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error('Router not found');
    router.close();
    return true;
  }

  async muteProducer(
    action: MuteAction,
    roomId: string,
    userId: string,
    producerId: string,
  ) {
    const producer = await this.findProducerById(roomId, producerId);
    // const producers = await this.findAllProducersByUserId(roomId, userId);
    if (!producer) throw new Error('no producer for mute');
    if (action === MuteAction.Mute) await producer.pause();
    else if (action === MuteAction.UnMute) await producer.resume();
    // if (!producers) throw new Error('no producer for mute');
    // if (action === MuteAction.Mute) {
    //   producers.forEach((element: Producer) => {
    //     element.pause();
    //   });
    // } else if (action === MuteAction.UnMute) {
    //   producers.forEach((element: Producer) => {
    //     element.resume();
    //   });
    // }
    return true;
  }
}
