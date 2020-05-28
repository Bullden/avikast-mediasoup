import {createWorker} from 'mediasoup';
import IMediasoup from './IMediasoup';
import Worker from './Worker';
import Router from './Router';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {DtlsParameters, Transport} from 'mediasoup/lib/types';

export default class Mediasoup extends IMediasoup implements IMediasoupInternal {
  private readonly workers: Array<Worker> = [];

  private readonly routers: Map<string, Router> = new Map<string, Router>();

  constructor(private readonly config: MediasoupConfig) {
    super();
  }

  private findBestWorker(): Worker {
    const worker = this.workers[0];
    if (!worker) throw new Error('worker not exists');
    return worker;
  }

  public async createWorker() {
    const worker = new Worker(this, await createWorker());
    this.workers.push(worker);
    return worker;
  }

  public async createRouter() {
    const worker = await this.findBestWorker();
    const router = await worker.createRouter();
    if (!router) throw new Error('no router!');
    this.routers.set('test', router);
    return router;
  }

  public getRouterByName(name: string) {
    const router = this.routers.get(name);
    if (!router) throw new Error(`router ${name} foes not exist`);
    return router;
  }

  // eslint-disable-next-line class-methods-use-this
  public async connectTransport(dtlsParameters: DtlsParameters, transport: Transport) {
    await transport.connect({dtlsParameters});
  }

  getConfig(): MediasoupConfig {
    return this.config;
  }
}
