import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';

export default class Consumer {
  constructor(mediasoup: IMediasoupInternal, private readonly instance: types.Consumer) {
    this.instance = instance;
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public get id() {
    return this.instance.id;
  }

  public get producerId() {
    return this.instance.producerId;
  }

  public get rtpParameters() {
    return this.instance.rtpParameters;
  }
}
