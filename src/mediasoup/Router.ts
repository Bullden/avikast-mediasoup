import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {Transport} from 'mediasoup/lib/Transport';

export default class Router {
  private readonly transports: Array<Transport> = [];

  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Router,
  ) {}

  public get rtpCapabilities(): types.RtpCapabilities {
    return this.instance.rtpCapabilities;
  }

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
    this.transports.push(transport);
    const {id, iceCandidates, iceParameters, dtlsParameters} = transport;
    return {id, iceCandidates, iceParameters, dtlsParameters};
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public findTransportByRoomId(roomId: string) {
    for (const transport of this.transports) {
      if (transport.appData.roomId === roomId) return transport;
    }
    return undefined;
  }
}
