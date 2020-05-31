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
    const transport = await this.roomManager.createTransport(request.roomId);
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
    );
  }

  @MessagePattern({area: 'producer', action: 'create'})
  async createProducer(request: CreateProducerRequest): Promise<CreateProducerResponse> {
    const {id} = await this.roomManager.createProducer(
      request.transportId,
      request.roomId,
      request.kind,
      request.rtpParameters as RtpParameters,
    );
    return {
      producerId: id,
    };
  }

  @MessagePattern({area: 'consumer', action: 'create'})
  async createConsumer(request: CreateConsumerRequest): Promise<CreateConsumerResponse> {
    const consumerOptions = await this.roomManager.createConsumer(
      request.producerId,
      request.roomId,
      request.rtpCapabilities,
    );
    return {
      id: consumerOptions.id,
      producerId: consumerOptions.producerId,
      rtpParameters: consumerOptions.rtpParameters,
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
