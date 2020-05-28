import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';

export default class Transport {
  constructor(
    mediasoup: IMediasoupInternal,
    private readonly instance: types.Transport,
  ) {}

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public async connectToRouter(dtlsParameters: DtlsParameters): Promise<boolean> {
    await this.instance.connect({dtlsParameters});
    return true;
  }
}
