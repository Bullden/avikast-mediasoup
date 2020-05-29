import Router from 'entities/Router';
import TransportOptions from '../../entities/TransportOptions';
import {DtlsParameters, RtpParameters} from 'mediasoup/lib/types';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<Router>;

  abstract createTransport(roomId: string): Promise<TransportOptions>;

  abstract connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
  ): Promise<Boolean>;

  abstract sendTrack(
    transportId: string,
    roomId: string,
    kind: string,
    rtpParameters: RtpParameters,
  ): Promise<string>;
}
