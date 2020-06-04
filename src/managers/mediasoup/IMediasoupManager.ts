import {
  ConsumerOptions,
  MediaAttributes,
  ProducerOptions,
  RouterOptions,
  TransportOptions,
} from 'entities/Mediasoup';
import {DtlsParameters} from 'mediasoup/lib/types';
import Producer from 'mediasoup/Producer';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<RouterOptions>;

  abstract createTransport(
    roomId: string,
    userId: string,
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
    userId: string,
    rtpParameters: object,
  ): Promise<ProducerOptions>;

  abstract createConsumer(
    roomId: string,
    producerId: string,
    rtpCapabilities: object,
    clientId: string,
    userId: string,
  ): Promise<ConsumerOptions>;

  abstract findRouter(roomId: string): Promise<RouterOptions>;

  abstract getProducers(roomId: string): Promise<ProducerOptions[]>;

  abstract findProducer(
    roomId: string,
    userId: string,
  ): Promise<ProducerOptions> | undefined;

  abstract findConsumer(
    roomId: string,
    userId: string,
    clientId: string,
  ): Promise<ConsumerOptions | undefined>;
}
