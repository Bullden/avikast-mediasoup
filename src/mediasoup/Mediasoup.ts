import IMediasoup from './IMediasoup';
import Worker from './Worker';

export default class Mediasoup extends IMediasoup {
  private workers: Array<Worker>;

  constructor(initialWorkers: Array<Worker>) {
    super();
    this.workers = initialWorkers;
  }

  private findBestWorker(): Worker {
    const worker = this.workers[0];
    if (!worker) throw new Error('worker not exists');
    return worker;
  }

  public async createRouter() {
    return this.findBestWorker().createRouter();
  }
}
