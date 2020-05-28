import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {WebRtcTransportOptions} from 'mediasoup/lib/WebRtcTransport';

export default class Router {
  constructor(mediasoup: IMediasoupInternal, private readonly instance: types.Router) {}

  public get rtpCapabilities(): types.RtpCapabilities {
    return this.instance.rtpCapabilities;
  }

  public async createTransport(
    parameters: WebRtcTransportOptions,
  ): Promise<types.WebRtcTransport> {
    return this.instance.createWebRtcTransport(parameters);
  }
}
