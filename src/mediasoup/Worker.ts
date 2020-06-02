import {types} from 'mediasoup';
import Router from './Router';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {BaseEntity} from 'mediasoup/BaseEntity';

export default class Worker extends BaseEntity {
  private readonly _routers: Array<Router> = [];

  public constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Worker,
  ) {
    super();
  }

  public async createRouter(roomId: string) {
    const config = this.mediasoup.getConfig();
    const {mediaCodecs} = config;
    const router = new Router(
      this.mediasoup,
      await this.instance.createRouter({mediaCodecs, appData: {roomId}}),
    );
    this._routers.push(router);
    return router;
  }

  public get routers() {
    return [...this._routers];
  }

  public findRouterByRoomId(roomId: string) {
    for (const router of this.routers) {
      if (router.roomId === roomId) return router;
    }

    return undefined;
  }

  get appData() {
    return this.instance.appData;
  }
}
