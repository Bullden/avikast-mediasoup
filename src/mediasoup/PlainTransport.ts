import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {Filter, matchAppData} from 'mediasoup/Utils';
import {BaseEntity} from 'mediasoup/BaseEntity';
import {MediaKind} from 'entities/Mediasoup';
import {SrtpParameters} from 'mediasoup/lib/SrtpParameters';

export default class PlainTransport extends BaseEntity {
  public readonly producers: Array<Producer> = [];

  public readonly consumers: Array<Consumer> = [];

  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.PlainTransport,
  ) {
    super();
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public get id() {
    return this.instance.id;
  }

  public get appData() {
    return this.instance.appData;
  }

  public get getProducers() {
    return this.producers;
  }

  public async createProducer(
    transportId: string,
    rtpParameters: types.RtpParameters,
    mediaKind: MediaKind,
    appData: object,
  ): Promise<Producer> {
    const producer = new Producer(
      this.mediasoup,
      await this.instance.produce({
        kind: mediaKind,
        rtpParameters,
        appData,
      }),
    );
    this.producers.push(producer);
    return producer;
  }

  public async createConsumer(
    producerId: string,
    rtpCapabilities: types.RtpCapabilities,
    appData: object,
  ): Promise<Consumer> {
    return new Consumer(
      this.mediasoup,
      await this.instance.consume({
        producerId,
        rtpCapabilities,
        appData,
      }),
    );
  }

  public findProducer(filter: Filter) {
    for (const producer of this.producers) {
      if (matchAppData(producer.appData, filter)) return producer;
    }
    return undefined;
  }

  public findConsumer(filter: Filter) {
    for (const consumer of this.consumers) {
      if (matchAppData(consumer.appData, filter)) return consumer;
    }
    return undefined;
  }

  public async connect(ip?: string, port?: number, rtcpPort?: number): Promise<void> {
    return this.instance.connect({ip, port, rtcpPort});
  }
}
