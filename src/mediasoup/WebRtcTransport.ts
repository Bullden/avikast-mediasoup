import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {Filter, matchAppData} from 'mediasoup/Utils';
import {BaseEntity} from 'mediasoup/BaseEntity';

export default class WebRtcTransport extends BaseEntity {
  private readonly producers: Array<Producer> = [];

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

  public async connectToRouter(dtlsParameters: types.DtlsParameters): Promise<void> {
    await this.instance.connect({dtlsParameters});
  }

  public async createProducer(
    transportId: string,
    appData: object,
    rtpParameters: types.RtpParameters,
  ): Promise<Producer> {
    const producer = new Producer(
      this.mediasoup,
      await this.instance.produce({
        kind: 'video',
        rtpParameters,
        appData,
      }),
    );
    this.producers.push(producer);
    return producer;
  }

  public async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: types.RtpCapabilities,
  ): Promise<Consumer> {
    console.log(rtpCapabilities, 'rtpCapabilities createConsumer');
    return new Consumer(
      this.mediasoup,
      await this.instance.consume({
        producerId,
        rtpCapabilities,
        appData: {roomId},
      }),
    );
  }

  public findProducer(filter: Filter) {
    for (const producer of this.producers) {
      if (matchAppData(producer.appData, filter)) return producer;
    }
    return undefined;
  }
}
