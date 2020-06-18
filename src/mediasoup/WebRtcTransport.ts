import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {Filter, matchAppData} from 'mediasoup/Utils';
import {BaseEntity} from 'mediasoup/BaseEntity';
import {MediaKind} from 'entities/Mediasoup';

export default class WebRtcTransport extends BaseEntity {
  public readonly producers: Array<Producer> = [];

  public readonly consumers: Array<Consumer> = [];

  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.WebRtcTransport,
  ) {
    super();
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public get id() {
    return this.instance.id;
  }

  public get iceCandidates() {
    return this.instance.iceCandidates;
  }

  public get iceParameters() {
    return this.instance.iceParameters;
  }

  public get dtlsParameters() {
    return this.instance.dtlsParameters;
  }

  public get appData() {
    return this.instance.appData;
  }

  public get getProducers() {
    return this.producers;
  }

  public async connectToRouter(dtlsParameters: types.DtlsParameters): Promise<void> {
    await this.instance.connect({dtlsParameters});
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
    console.log(`create producer with room id ${producer.roomId}`, this.producers.length);
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
    console.log(this.producers, 'FIND PRODUCERS ARRAY');
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

  public get dtlsState() {
    return this.instance.dtlsState;
  }
}
