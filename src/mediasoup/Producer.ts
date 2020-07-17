import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import {BaseEntity} from 'mediasoup/BaseEntity';
import Transport from 'mediasoup/Transport';

export default class Producer extends BaseEntity {
  constructor(
    mediasoup: IMediasoupInternal,
    private readonly transport: Transport,
    private readonly instance: types.Producer,
  ) {
    super();
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

  public close() {
    const result = this.instance.close();
    this.transport.removeProducer(this);
    return result;
  }
}
