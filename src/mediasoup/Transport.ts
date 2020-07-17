import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {Filter, matchAppData} from 'mediasoup/Utils';
import {BaseEntity} from 'mediasoup/BaseEntity';
import Router from 'mediasoup/Router';

export default abstract class Transport extends BaseEntity {
  public readonly producers: Array<Producer> = [];

  public readonly consumers: Array<Consumer> = [];

  constructor(
    protected readonly mediasoup: IMediasoupInternal,
    protected readonly baseRouter: Router,
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
    this.producers.forEach((producer) => {
      producer.close();
      console.log('close room producer iteration', producer.id);
    });
    this.baseInstance.close();
    this.baseRouter.removeTransport(this);
  }

  public pushProducer(producer: Producer) {
    this.producers.push(producer);
  }

  public pushConsumer(consumer: Consumer) {
    this.consumers.push(consumer);
  }

  public removeProducer(prodcer: Producer) {
    const index = this.producers.indexOf(prodcer);
    if (index < 0) throw new Error('Transport not fount');
    this.producers.splice(index, 1);
  }

  public removeConsumer(consumer: Consumer) {
    const index = this.consumers.indexOf(consumer);
    if (index < 0) throw new Error('Transport not fount');
    this.consumers.splice(index, 1);
  }
}
