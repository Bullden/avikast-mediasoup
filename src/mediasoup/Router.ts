import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Transport from './WebRtcTransport';
import {MediaAttributes} from 'entities/Mediasoup';
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

  public async createWebRtcTransport(roomId: string, mediaAttributes: MediaAttributes) {
    const config = this.mediasoup.getConfig();
    const transport = new Transport(
      this.mediasoup,
      await this.instance.createWebRtcTransport({
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        listenIps: config.listenIps,
        initialAvailableOutgoingBitrate: config.initialAvailableOutgoingBitrate,
        appData: {roomId, mediaAttributes},
      }),
    );
    this.transports.push(transport);
    return transport;
  }

  public get roomId() {
    return this.instance.appData.roomId;
  }

  public findTransport(filter: Filter) {
    return this.transports.find((transport) => transport.matchAppData(filter));
  }

  get appData() {
    return this.instance.appData;
  }
}
