import {types} from 'mediasoup';
import Router from './Router';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {BaseEntity} from 'mediasoup/BaseEntity';
import {Filter} from 'mediasoup/Utils';

export default class Worker extends BaseEntity {
  private readonly _routers: Array<Router> = [];

  public constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Worker,
  ) {
    super();
  }

  public async createRouter(appData: Filter) {
    const config = this.mediasoup.getConfig();
    const {mediaCodecs} = config;
    const router = new Router(
      this.mediasoup,
      await this.instance.createRouter({mediaCodecs, appData}),
    );
    this._routers.push(router);
    return router;
  }

  public get routers() {
    return [...this._routers];
  }

  public findRouter(filter: Filter) {
    return this.routers.find((router) => router.matchAppData(filter));
  }

  get appData() {
    return this.instance.appData;
  }

  get getRouters() {
    return this._routers;
  }

  public removeRouter(roomId: string) {
    const router = this.routers.find((router) => router.matchAppData({roomId}));
    if (!router) throw new Error('Close router: router has not been found');
    this._routers.filter((element) => {
      return element.roomId !== router.roomId;
    });
    // const routerArr = this._routers.filter((element) => {
    //   return element.roomId !== router.roomId;
    // });
    // this._routers.push(...routerArr);
  }
}
