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

  public async createRouter(roomId: string) {
    const worker = this.findBestWorker();
    return worker.createRouter(roomId);
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

  public findRouterByRoomId(roomId: string) {
    for (const worker of this.workers) {
      const router = worker.findRouterByRoomId(roomId);
      if (router) {
        return router;
      }
    }

    return undefined;
  }

  // async findProducerByRoomId(roomId: string) {
  //   const room = this.findRouterByRoomId(roomId);
  //   if (!room) throw new Error('room not exists');
  //   const producerOptions = room.findProducerByRoomId(roomId);
  //   return producerOptions;
  // }

  // eslint-disable-next-line class-methods-use-this

  getConfig(): MediasoupConfig {
    return this.config;
  }
}
