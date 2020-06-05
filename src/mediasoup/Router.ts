import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Transport from './WebRtcTransport';
import {BaseEntity} from 'mediasoup/BaseEntity';
import {Filter} from 'mediasoup/Utils';

export default class Router extends BaseEntity {
  private readonly transports: Array<Transport> = [];

  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Router,
  ) {
    super();
  }

  public get rtpCapabilities(): types.RtpCapabilities {
    return this.instance.rtpCapabilities;
  }

  public async createWebRtcTransport(appData: Filter) {
    const config = this.mediasoup.getConfig();
    const transport = new Transport(
      this.mediasoup,
      await this.instance.createWebRtcTransport({
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        listenIps: config.listenIps,
        initialAvailableOutgoingBitrate: config.initialAvailableOutgoingBitrate,
        appData,
      }),
    );
    console.log(
      `Create transport by clientid ${appData.clientId} direction ${appData.direction} and roomid ${appData.roomId}`,
    );
    this.transports.push(transport);
    return transport;
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public getTransports() {
    return this.transports;
  }

  public findTransport(filter: Filter) {
    for (const transport of this.transports) {
      if (transport.matchAppData(filter)) {
        return transport;
      }
    }

    return undefined;
  }

  get appData() {
    return this.instance.appData;
  }
}
