import Router from 'entities/Router';
import TransportOptions from '../../entities/TransportOptions';
import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<Router>;

  abstract createTransport(roomId: string): Promise<TransportOptions>;

  abstract connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
  ): Promise<Boolean>;
}
