// eslint-disable-next-line no-console
import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';
import Producer from './Producer';
import Consumer from './Consumer';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/RtpParameters';
import ConsumerOptions from '../entities/ConsumerOptions';

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

  public async connectToRouter(dtlsParameters: DtlsParameters): Promise<boolean> {
    await this.instance.connect({dtlsParameters});
    return true;
  }

  public async createProducer(
    transportId: string,
    roomId: string,
    kind: string,
    rtpParameters: RtpParameters,
  ): Promise<string> {
    const producer = new Producer(
      this.mediasoup,
      await this.instance.produce({
        kind: 'video',
        rtpParameters,
        appData: {roomId},
      }),
    );
    console.log(producer.id, 'PRODUCERID');
    return producer.id;
  }

  public async createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<ConsumerOptions> {
    const consumer = new Consumer(
      this.mediasoup,
      await this.instance.consume({
        producerId,
        rtpCapabilities,
        appData: {roomId},
      }),
    );
    console.log(consumer.id, 'Consumer');
    return {
      id: consumer.id,
      producerId: consumer.producerId,
      rtpParameters: consumer.rtpParameters,
    };
  }
}
