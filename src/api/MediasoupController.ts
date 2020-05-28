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
      iceCandidates: transport.iceParameters,
      iceParameters: transport.iceParameters,
    };
  }

  @MessagePattern({area: 'transport', action: 'connect'})
  async connectTransport(
    request: ConnectTransportRequest,
  ): Promise<ConnectTransportResponse> {
    // eslint-disable-next-line no-console
    console.log(request.dtlsParameters);
    await this.roomManager.connectTransport(request.roomId, request.dtlsParameters);
    return {};
  }
}
