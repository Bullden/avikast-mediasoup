import {
  ConsumerOptions,
  MediaAttributes,
  ProducerOptions,
  RouterOptions,
  TransportOptions,
} from 'entities/Mediasoup';
import {DtlsParameters} from 'mediasoup/lib/types';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<RouterOptions>;

  abstract createTransport(
    roomId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ): Promise<TransportOptions>;

  abstract connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
    direction: 'send' | 'receive',
    clientId: string,
  ): Promise<void>;

  abstract createProducer(
    transportId: string,
    roomId: string,
    clientId: string,
    rtpParameters: object,
  ): Promise<ProducerOptions>;

  abstract createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: object,
    clientId: string,
  ): Promise<ConsumerOptions>;

  abstract findRouter(roomId: string): Promise<RouterOptions>;

  abstract findProducer(roomId: string, userId: string): Promise<ProducerOptions>;
}
