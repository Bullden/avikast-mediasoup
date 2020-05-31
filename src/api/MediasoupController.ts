import {Controller} from '@nestjs/common';
import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {MessagePattern} from 'api/enhancers/MessagePattern';
import {CreateRouterRequest, CreateRouterResponse} from 'api/entities/CreateRouter';
import {
  CreateTransportRequest,
  CreateTransportResponse,
} from './entities/CreateTransport';
import {
  ConnectTransportRequest,
  ConnectTransportResponse,
} from './entities/ConnectTransport';
import {SendTrackRequest, SendTrackResponse} from './entities/SendTrack';
import {CreateConsumerRequest, CreateConsumerResponse} from './entities/CreateConsumer';
import {
  FindProducerByRoomIdRequest,
  FindProducerByRoomIdResponse,
} from './entities/FindProducerByRoomId';
import {
  GetRouterCapabilitiesByRoomIdRequest,
  GetRouterCapabilitiesByRoomIdResponse,
} from './entities/GetRouterRtpCapabilities';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';
import {RtpParameters} from 'mediasoup/lib/RtpParameters';

@Controller()
export default class MediasoupController {
  constructor(private readonly roomManager: IMediasoupManager) {}

  @MessagePattern({area: 'router', action: 'create'})
  async createRouter(request: CreateRouterRequest): Promise<CreateRouterResponse> {
    const router = await this.roomManager.createRouter(request.roomId);
    return {rtpCapabilities: router.rtpCapabilities};
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
    // eslint-disable-next-line no-console
    await this.roomManager.connectTransport(
      request.roomId,
      request.dtlsParameters as DtlsParameters,
    );
    return {};
  }

  @MessagePattern({area: 'track', action: 'send'})
  async sendTrack(request: SendTrackRequest): Promise<SendTrackResponse> {
    // eslint-disable-next-line no-console
    const {transportId, roomId, kind, rtpParameters} = request;
    const {id} = await this.roomManager.sendTrack(
      transportId,
      roomId,
      kind,
      rtpParameters as RtpParameters,
    );
    console.log(producerId, 'MessagePattern');
    return {producerId: id};
  }

  @MessagePattern({area: 'consumer', action: 'create'})
  async createConsumer(request: CreateConsumerRequest): Promise<CreateConsumerResponse> {
    // eslint-disable-next-line no-console
    const {producerId, roomId, rtpCapabilities} = request;
    const consumerOptions = await this.roomManager.createConsumer(
      producerId,
      roomId,
      rtpCapabilities,
    );
    return {
      id: consumerOptions.id,
      producerId: consumerOptions.producerId,
      rtpParameters: consumerOptions.rtpParameters,
    };
  }

  @MessagePattern({area: 'producer', action: 'find'})
  async findProducerByRoomId(
    request: FindProducerByRoomIdRequest,
  ): Promise<FindProducerByRoomIdResponse> {
    // eslint-disable-next-line no-console
    const {roomId} = request;
    const producerOptions = await this.roomManager.findProducerByRoomId(roomId);
    return producerOptions;
  }

  @MessagePattern({area: 'router', action: 'get'})
  async getRouterCapabilitiesByRoomId(
    request: GetRouterCapabilitiesByRoomIdRequest,
  ): Promise<GetRouterCapabilitiesByRoomIdResponse> {
    // eslint-disable-next-line no-console
    const {roomId} = request;
    const router = await this.roomManager.findRouterByRoomId(roomId);
    return {
      rtpCapabilities: router.rtpCapabilities,
    };
  }
}
