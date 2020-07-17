import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {Filter, matchAppData, removeFromArray} from 'mediasoup/Utils';
import {BaseEntity} from 'mediasoup/BaseEntity';

export default abstract class Transport extends BaseEntity {
  public readonly producers: Array<Producer> = [];

  public readonly consumers: Array<Consumer> = [];

  constructor(
    protected readonly mediasoup: IMediasoupInternal,
    protected baseInstance: types.Transport,
  ) {
    super();
  }

  public get roomId() {
    return this.baseInstance.appData.roomId;
  }

  public get id() {
    return this.baseInstance.id;
  }

  public get appData() {
    return this.baseInstance.appData;
  }

  public get getProducers() {
    return this.producers;
  }

  public async connectToRouter(dtlsParameters: types.DtlsParameters): Promise<void> {
    await this.baseInstance.connect({dtlsParameters});
  }

  public findProducer(filter: Filter) {
    for (const producer of this.producers) {
      if (matchAppData(producer.appData, filter)) return producer;
    }
    return undefined;
  }

  public findProducers(filter: Filter) {
    return this.producers.filter((producer) => producer.matchAppData(filter));
  }

  public findConsumer(filter: Filter) {
    for (const consumer of this.consumers) {
      if (matchAppData(consumer.appData, filter)) return consumer;
    }
    return undefined;
  }

  public close() {
    this.producers.forEach(this.closeProducer);
    this.consumers.forEach(this.closeConsumer);
    this.baseInstance.close();
  }

  public pushProducer(producer: Producer) {
    this.producers.push(producer);
  }

  public pushConsumer(consumer: Consumer) {
    this.consumers.push(consumer);
  }

  public closeProducer(producer: Producer) {
    producer.close();
    removeFromArray(this.producers, producer);
  }

  public closeConsumer(consumer: Consumer) {
    consumer.close();
    removeFromArray(this.consumers, consumer);
  }
}
