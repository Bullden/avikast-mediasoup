import IMediasoup from './IMediasoup';
import Worker from './Worker';

export default class Mediasoup extends IMediasoup {
  private workers: Worker[];

  constructor(initialWorkers: Worker[]) {
    super();
    this.workers = initialWorkers;
  }
}
