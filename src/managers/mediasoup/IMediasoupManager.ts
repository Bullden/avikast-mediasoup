import Router from 'entities/Router';
import TransportOptions from '../../entities/TransportOptions';
import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import ConsumerOptions from '../../entities/ConsumerOptions';

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

  abstract createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<ConsumerOptions>;
}
