import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Transport from './WebRtcTransport';
import {BaseEntity} from 'mediasoup/BaseEntity';
import {Filter} from 'mediasoup/Utils';
import PlainRtpTransport from './PlainTransport';
import {IConfigService} from '@spryrocks/config-node';

export default class Router extends BaseEntity {
  private readonly transports: Array<Transport> = [];

  private readonly plainTransports: Array<PlainRtpTransport> = [];

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
    this.transports.push(transport);
    return transport;
  }

  public async createPlainTransport(appData: Filter, configService: IConfigService) {
    const transport = new PlainRtpTransport(
      this.mediasoup,
      await this.instance.createPlainTransport({
        listenIp: configService.get('LISTEN_IP'),
        comedia: false,
        rtcpMux: false,
        appData,
      }),
    );
    this.plainTransports.push(transport);
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
