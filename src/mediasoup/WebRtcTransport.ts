import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Producer from './Producer';
import Consumer from './Consumer';

export default class WebRtcTransport {
  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.WebRtcTransport,
  ) {}

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
    roomId: string,
    kind: string,
    rtpParameters: types.RtpParameters,
  ): Promise<Producer> {
    return new Producer(
      this.mediasoup,
      await this.instance.produce({
        kind: 'video',
        rtpParameters,
        appData: {roomId},
      }),
    );
  }

  public async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: types.RtpCapabilities,
  ): Promise<Consumer> {
    return new Consumer(
      this.mediasoup,
      await this.instance.consume({
        producerId,
        rtpCapabilities,
        appData: {roomId},
      }),
    );
  }
}
