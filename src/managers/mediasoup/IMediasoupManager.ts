import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import TransportOptions from 'entities/TransportOptions';
import ConsumerOptions from 'entities/ConsumerOptions';
import ProducerOptions from 'entities/ProducerOptions';
import RouterOptions from 'entities/RouterOptions';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<RouterOptions>;

  abstract createTransport(
    roomId: string,
    direction: 'send' | 'receive',
  ): Promise<TransportOptions>;

  abstract connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
    direction: 'send' | 'receive',
  ): Promise<void>;

  abstract createProducer(
    transportId: string,
    roomId: string,
    rtpParameters: RtpParameters,
  ): Promise<ProducerOptions>;

  abstract createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<ConsumerOptions>;

  abstract findRouterByRoomId(roomId: string): Promise<RouterOptions>;
}
