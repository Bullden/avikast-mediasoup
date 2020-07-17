import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';
import {MediaKind} from 'entities/Mediasoup';
import Transport from 'mediasoup/Transport';
import Router from 'mediasoup/Router';

export default class WebRtcTransport extends Transport {
  constructor(
    readonly mediasoup: IMediasoupInternal,
    readonly router: Router,
    private readonly instance: types.WebRtcTransport,
  ) {
    super(mediasoup, router, instance);
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

  public async createProducer(
    transportId: string,
    rtpParameters: types.RtpParameters,
    mediaKind: MediaKind,
    appData: object,
  ): Promise<Producer> {
    const producer = new Producer(
      this.mediasoup,
      this,
      await this.instance.produce({
        kind: mediaKind,
        rtpParameters,
        appData,
      }),
    );
    this.pushProducer(producer);
    return producer;
  }

  public async createConsumer(
    producerId: string,
    rtpCapabilities: types.RtpCapabilities,
    appData: object,
  ): Promise<Consumer> {
    const consumer = new Consumer(
      this.mediasoup,
      await this.instance.consume({
        producerId,
        rtpCapabilities,
        appData,
      }),
    );
    this.pushConsumer(consumer);
    return consumer;
  }

  public get dtlsState() {
    return this.instance.dtlsState;
  }
}
