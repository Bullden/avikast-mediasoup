import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';

export default class Router {
  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Router,
  ) {}

  public get rtpCapabilities(): types.RtpCapabilities {
    return this.instance.rtpCapabilities;
  }

  // public async createTransport(
  //   parameters: WebRtcTransportOptions,
  // ): Promise<types.WebRtcTransport> {
  //   return this.instance.createWebRtcTransport(parameters);
  // }

  public async createWebRtcTransport(transportId: string) {
    // const router = this.routers.get(name);
    // if (!router) throw new Error('no router!');
    const config = this.mediasoup.getConfig();
    const transport = await this.instance.createWebRtcTransport({
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      listenIps: config.listenIps,
      initialAvailableOutgoingBitrate: config.initialAvailableOutgoingBitrate,
      appData: {transportId},
    });
    const {id, iceCandidates, iceParameters, dtlsParameters} = transport;
    return {id, iceCandidates, iceParameters, dtlsParameters};
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }
}
