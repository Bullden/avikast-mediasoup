import {createWorker} from 'mediasoup';
import IMediasoup from './IMediasoup';
import Worker from './Worker';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {Filter} from 'mediasoup/Utils';

export default class Mediasoup extends IMediasoup implements IMediasoupInternal {
  private readonly workers: Array<Worker> = [];

  constructor(private readonly config: MediasoupConfig) {
    super();
  }

  public async createRouter(appData: Filter) {
    const worker = this.findBestWorker();
    const router = await worker.createRouter(appData);
    return router;
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

  public findRouter(filter: Filter) {
    for (const worker of this.workers) {
      const router = worker.findRouter(filter);
      if (router) return router;
    }
    return undefined;
  }

  getConfig(): MediasoupConfig {
    return this.config;
  }
}
