// eslint-disable-next-line no-console
import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';
import Producer from './Producer';
import Consumer from './Consumer';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/RtpParameters';

export default class WebRtcTransport {
  private readonly producers: Array<Producer> = [];

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

  public async connectToRouter(dtlsParameters: DtlsParameters): Promise<void> {
    await this.instance.connect({dtlsParameters});
  }

  public async createProducer(
    transportId: string,
    roomId: string,
    kind: string,
    rtpParameters: RtpParameters,
  ): Promise<Producer> {
    const producer = new Producer(
      this.mediasoup,
      await this.instance.produce({
        kind: 'video',
        rtpParameters,
        appData: {roomId},
      }),
    );
    this.producers.push(producer);
    return producer;
  }

  public async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
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

  public async findProducerByRoomId(roomId: string) {
    return this.producers.find((producer) => {
      return producer.roomId === roomId;
    });
  }
}
