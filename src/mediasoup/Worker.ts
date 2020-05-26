import {types, createWorker} from 'mediasoup';

export default class Worker {
  public static async createWorker() {
    const instance = await createWorker();
    return new Worker(instance);
  }

  private readonly instance: types.Worker;

  private constructor(instance: types.Worker) {
    this.instance = instance;
  }
}
