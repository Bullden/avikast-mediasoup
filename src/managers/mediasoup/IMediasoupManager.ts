import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import TransportOptions from 'entities/TransportOptions';
import ConsumerOptions from 'entities/ConsumerOptions';
import ProducerOptions from 'entities/ProducerOptions';
import RouterOptions from 'entities/RouterOptions';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<RouterOptions>;

  abstract createTransport(roomId: string): Promise<TransportOptions>;

  abstract connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
  ): Promise<void>;

  abstract createProducer(
    transportId: string,
    roomId: string,
    kind: string,
    rtpParameters: RtpParameters,
  ): Promise<ProducerOptions>;

  abstract findProducerByRoomId(roomId: string): Promise<ProducerOptions>;

  abstract createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<ConsumerOptions>;

  abstract findRouterByRoomId(roomId: string): Promise<RouterOptions>;
}
