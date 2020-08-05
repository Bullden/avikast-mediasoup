import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {Filter, matchAppData, removeFromArray} from 'mediasoup/Utils';
import {BaseEntity} from 'mediasoup/BaseEntity';
import {log} from 'util';

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

  public async connectToRouter(
    dtlsParameters: types.DtlsParameters,
    roomId: string,
    transportId: string,
  ): Promise<void> {
    await this.baseInstance.connect({dtlsParameters});
    this.baseInstance.on('icestatechange', (iceState) => {
      log(`ICE state changed to ${iceState}`);
      if (iceState === 'completed') {
        this.mediasoup.removeTransport(roomId, transportId);
      }
      if (iceState === 'disconected') {
        this.mediasoup.removeTransport(roomId, transportId);
      }
    });
  }

  public findProducer(filter: Filter) {
    for (const producer of this.producers) {
      if (matchAppData(producer.appData, filter)) return producer;
    }
    return undefined;
  }

  public findProducerById(producerId: String) {
    for (const producer of this.producers) {
      if (producer.id === producerId) return producer;
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
    this.producers.forEach((producer) => this.closeProducer(producer));
    this.consumers.forEach((consumer) => this.closeConsumer(consumer));
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
