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
    await this.roomManager.connectTransport(request.roomId, request.dtlsParameters);
    return {};
  }

  @MessagePattern({area: 'track', action: 'send'})
  async sendTrack(request: SendTrackRequest): Promise<SendTrackResponse> {
    // eslint-disable-next-line no-console
    console.log(11111111111);
    const {transportId, roomId, kind, rtpParameters} = request;
    const producerId = await this.roomManager.sendTrack(
      transportId,
      roomId,
      kind,
      rtpParameters,
    );
    return {producerId};
  }
}
