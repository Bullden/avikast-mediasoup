import {createWorker} from 'mediasoup';
import IMediasoup from './IMediasoup';
import Worker from './Worker';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {Filter, removeFromArray} from 'mediasoup/Utils';
import WorkerConfig from 'mediasoup/WorkerConfig';
import Router from 'mediasoup/Router';

export default class Mediasoup extends IMediasoup implements IMediasoupInternal {
  private readonly workers: Array<Worker> = [];

  constructor(private readonly config: MediasoupConfig) {
    super();
  }

  public async createRouter(appData: Filter) {
    const worker = this.findBestWorker();
    const testRouter = this.findRouter(appData);
    if (testRouter) throw new Error('Router alreedy created');
    const router = await worker.createRouter(appData);
    return router;
  }

  private findBestWorker(): Worker {
    const worker = this.workers[0];
    if (!worker) throw new Error('worker not exists');
    return worker;
  }

  public async createWorker(config: WorkerConfig) {
    const worker = new Worker(
      this,
      await createWorker({
        rtcMinPort: config.rtcMinPort,
        rtcMaxPort: config.rtcMaxPort,
      }),
    );
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

  public findWorker(roomId: string): Worker | undefined {
    let worker;
    // eslint-disable-next-line array-callback-return
    this.workers.find((element) => {
      worker = element.getRouters.find((router) => {
        return router.roomId === roomId;
        // if (router.roomId === roomId) {
        //   console.log('worker found!');
        // }
      });
    });
    if (!worker) throw new Error('worker not exists');
    return worker;
  }

  getConfig(): MediasoupConfig {
    return this.config;
  }

  getArray(): Worker[] {
    return this.workers;
  }

  closeRouter(router: Router) {
    const worker = this.findWorker(router.roomId);
    if (!worker) throw new Error('Worker not found');
    worker.closeRouter(router);
  }

  // public closeRouter(filter: Filter) {
  //   for (const worker of this.workers) {
  //     const router = worker.findRouter(filter);
  //     if (router) return router;
  //   }
  //   return undefined;
  // }
}
