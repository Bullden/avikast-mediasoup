import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';

export default class Producer {
  constructor(mediasoup: IMediasoupInternal, private readonly instance: types.Producer) {
    this.instance = instance;
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public get id() {
    return this.instance.id;
  }
}
