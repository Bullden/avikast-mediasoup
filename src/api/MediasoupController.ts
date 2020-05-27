import {Controller} from '@nestjs/common';
import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {MessagePattern} from 'api/enhancers/MessagePattern';
import {CreateRouterRequest, CreateRouterResponse} from 'api/entities/CreateRouter';

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
}
