import {Controller} from '@nestjs/common';
import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {MessagePattern} from 'api/enhancers/MessagePattern';
import {CreateRouterRequest, CreateRouterResponse} from 'api/entities/CreateRouter';
import {
  CreateTransportRequest,
  CreateTransportResponse,
} from './entities/CreateTransport';

@Controller()
export default class MediasoupController {
  constructor(private readonly roomManager: IMediasoupManager) {}

  @MessagePattern({area: 'router', action: 'create'})
  async createRouter(request: CreateRouterRequest): Promise<CreateRouterResponse> {
    // eslint-disable-next-line no-console
    console.log(request);
    const router = await this.roomManager.createRouter();
    return {rtpCapabilities: router.rtpCapabilities};
  }

  @MessagePattern({area: 'transport', action: 'create'}, response)
  async createTransport(
    request: CreateTransportRequest,
  ): Promise<CreateTransportResponse> {
    // eslint-disable-next-line no-console
    console.log(request);
    const transportOptions = await this.roomManager.createTransport(request.name);
    return {transportOptions};
  }
}
