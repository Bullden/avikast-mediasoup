import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';

export default class WebRtcTransport {
  constructor(
    mediasoup: IMediasoupInternal,
    private readonly instance: types.WebRtcTransport,
  ) {
    this.instance = instance;
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

  public async connectToRouter(dtlsParameters: DtlsParameters): Promise<boolean> {
    await this.instance.connect({dtlsParameters});
    return true;
  }
}
