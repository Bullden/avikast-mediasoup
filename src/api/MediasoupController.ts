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
  GetRouterRequest,
  GetRouterResponse,
} from 'api/entities';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';
import {RtpParameters} from 'mediasoup/lib/RtpParameters';
import {MediaAttributes} from 'entities/Mediasoup';

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
      request.mediaAttributes as MediaAttributes,
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
      request.mediaAttributes as MediaAttributes,
    );
  }

  @MessagePattern({area: 'producer', action: 'create'})
  async createProducer(request: CreateProducerRequest): Promise<CreateProducerResponse> {
    const producer = await this.roomManager.createProducer(
      request.transportId,
      request.roomId,
      request.rtpParameters as RtpParameters,
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
      request.producerId,
      request.roomId,
      request.rtpCapabilities,
    );
    return {
      id: consumer.id,
      producerId: consumer.producerId,
      rtpParameters: consumer.rtpParameters,
    };
  }

  @MessagePattern({area: 'router', action: 'get'})
  async getRouterCapabilitiesByRoomId(
    request: GetRouterRequest,
  ): Promise<GetRouterResponse> {
    const router = await this.roomManager.findRouterByRoomId(request.roomId);
    return {
      rtpCapabilities: router.rtpCapabilities,
    };
  }
}
