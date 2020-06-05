import {Controller} from '@nestjs/common';
import {IMediasoupManager} from 'managers';
import {MessagePattern} from './enhancers';
import {
  ConnectTransportRequest,
  ConnectTransportResponse,
  CreateConsumerRequest,
  CreateConsumerResponse,
  CreateProducerRequest,
  CreateProducerResponse,
  CreateRouterRequest,
  CreateRouterResponse,
  CreateTransportRequest,
  CreateTransportResponse,
  GetProducerRequest,
  GetProducerResponse,
  GetProducersRequest,
  GetProducersResponse,
  GetRouterRequest,
  GetRouterResponse,
} from 'api/entities';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';
import {Direction} from 'entities/Mediasoup';

@Controller()
export default class MediasoupController {
  constructor(private readonly roomManager: IMediasoupManager) {}

  @MessagePattern({area: 'router', action: 'create'})
  async createRouter(request: CreateRouterRequest): Promise<CreateRouterResponse> {
    const router = await this.roomManager.createRouter(request.roomId);
    return {
      rtpCapabilities: router.rtpCapabilities,
    };
  }

  @MessagePattern({area: 'transport', action: 'create'})
  async createTransport(
    request: CreateTransportRequest,
  ): Promise<CreateTransportResponse> {
    const transport = await this.roomManager.createTransport(
      request.roomId,
      request.userId,
      request.direction,
      request.clientId,
    );

    return {
      id: transport.id,
      dtlsParameters: transport.dtlsParameters,
      iceCandidates: transport.iceCandidates,
      iceParameters: transport.iceParameters,
    };
  }

  @MessagePattern({area: 'transport', action: 'connect'})
  async connectTransport(
    request: ConnectTransportRequest,
  ): Promise<ConnectTransportResponse> {
    await this.roomManager.connectTransport(
      request.roomId,
      request.dtlsParameters as DtlsParameters,
      request.direction as Direction,
      request.clientId,
    );
  }

  @MessagePattern({area: 'producer', action: 'create'})
  async createProducer(request: CreateProducerRequest): Promise<CreateProducerResponse> {
    const producer = await this.roomManager.createProducer(
      request.roomId,
      request.transportId,
      request.userId,
      request.clientId,
      request.rtpParameters,
    );
    return {
      producerId: producer.id,
      kind: producer.kind,
      rtpParameters: producer.rtpParameters,
    };
  }

  @MessagePattern({area: 'consumer', action: 'create'})
  async createConsumer(request: CreateConsumerRequest): Promise<CreateConsumerResponse> {
    const consumer = await this.roomManager.createConsumer(
      request.roomId,
      request.producerId,
      request.rtpCapabilities,
      request.clientId,
      request.userId,
    );
    return {
      id: consumer.id,
      producerId: consumer.producerId,
      rtpParameters: consumer.rtpParameters,
    };
  }

  @MessagePattern({area: 'producer', action: 'get'})
  async getProducer(request: GetProducerRequest): Promise<GetProducerResponse> {
    const producer = await this.roomManager.findProducer(request.roomId, request.userId);
    if (!producer) throw new Error(`API producer has not been found`);
    return {
      id: producer.id,
      kind: producer.kind,
      rtpParameters: producer.rtpParameters,
    };
  }

  @MessagePattern({area: 'router', action: 'get'})
  async getRouter(request: GetRouterRequest): Promise<GetRouterResponse> {
    const router = await this.roomManager.findRouter(request.roomId);
    return {
      rtpCapabilities: router.rtpCapabilities,
    };
  }

  @MessagePattern({area: 'producers', action: 'receive'})
  async getProducers(request: GetProducersRequest): Promise<GetProducersResponse> {
    console.log('GET PRODUCERS');
    const producers = await this.roomManager.getProducers(request.roomId);
    if (!producers) throw new Error(`API producer has not been found`);
    return {
      producers,
    };
  }
}
