import {types, createWorker} from 'mediasoup';
import Router from './Router';

export default class Worker {
  public static async createWorker() {
    return new Worker(await createWorker());
  }

  private readonly _routers: Array<Router> = [];

  private constructor(private readonly instance: types.Worker) {
    this.instance = instance;
  }

  public async createRouter() {
    const router = new Router(await this.instance.createRouter());
    this._routers.push(router);
    return router;
  }

  public get routers() {
    return [...this._routers];
  }
}
