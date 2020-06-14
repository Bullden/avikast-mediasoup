import {
  ConsumerOptions,
  MediaKind,
  MediaType,
  ProducerOptions,
  RouterOptions,
  TransportOptions,
} from 'entities/Mediasoup';

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
    dtlsParameters: object,
    direction: 'send' | 'receive',
    clientId: string,
  ): Promise<void>;

  abstract createProducer(
    roomId: string,
    transportId: string,
    clientId: string,
    userId: string,
    rtpParameters: object,
    mediaType: MediaType,
    mediaKind: MediaKind,
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
    clientId: string,
    userId: string,
  ): Promise<ConsumerOptions> | undefined;
}
