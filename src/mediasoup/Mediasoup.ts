import {createWorker} from 'mediasoup';
import IMediasoup from './IMediasoup';
import Worker from './Worker';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';

export default class Mediasoup extends IMediasoup implements IMediasoupInternal {
  private readonly workers: Array<Worker> = [];

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
    return this.findBestWorker().createRouter();
  }

  getConfig(): MediasoupConfig {
    return this.config;
  }
}
