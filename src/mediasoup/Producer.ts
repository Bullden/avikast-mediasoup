import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';

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

  public get kind() {
    return this.instance.kind;
  }

  public get appData() {
    return this.instance.appData;
  }

  public get rtpParameters() {
    return this.instance.rtpParameters;
  }
}
