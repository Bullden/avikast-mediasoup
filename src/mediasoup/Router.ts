import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Transport from './WebRtcTransport';

export default class Router {
  private readonly transports: Array<Transport> = [];

  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Router,
  ) {}

  public get rtpCapabilities(): types.RtpCapabilities {
    return this.instance.rtpCapabilities;
  }

  public async createWebRtcTransport(roomId: string) {
    const config = this.mediasoup.getConfig();
    const transport = new Transport(
      this.mediasoup,
      await this.instance.createWebRtcTransport({
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        listenIps: config.listenIps,
        initialAvailableOutgoingBitrate: config.initialAvailableOutgoingBitrate,
        appData: {roomId},
      }),
    );
    this.transports.push(transport);
    return transport;
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
