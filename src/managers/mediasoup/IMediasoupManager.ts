import Router from 'entities/Router';
import TransportOptions from '../../entities/TransportOptions';
import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import ConsumerOptions from '../../entities/ConsumerOptions';
import ProducerOptions from '../../entities/ProducerOptions';

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

  abstract findProducerByRoomId(roomId: string): Promise<ProducerOptions>;

  abstract createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<ConsumerOptions>;

  abstract getRouterCapabilitiesByRoomId(roomId: string): Promise<RtpCapabilities>;
}
