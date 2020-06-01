import {types} from 'mediasoup';
import IMediasoupInternal from './IMediasoupInternal';
import Transport from './WebRtcTransport';
import {MediaAttributes} from 'entities/Mediasoup';

export default class Router {
  private readonly transports: Array<Transport> = [];

  constructor(
    private readonly mediasoup: IMediasoupInternal,
    private readonly instance: types.Router,
  ) {}

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

  public findTransport(roomId: string, mediaAttributes: MediaAttributes) {
    for (const transport of this.transports) {
      if (
        transport.appData.roomId === roomId &&
        transport.appData.mediaAttributes.direction === mediaAttributes.direction &&
        transport.appData.mediaAttributes.kind === mediaAttributes.kind &&
        transport.appData.mediaAttributes.mediaType === mediaAttributes.mediaType
      )
        return transport;
    }
    return undefined;
  }

  public findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    for (const transport of this.transports) {
      // TODO should we remove this?
      if (
        transport.appData.roomId === roomId &&
        transport.appData.mediaAttributes.direction === direction
      )
        return transport;
    }
    return undefined;
  }
}
