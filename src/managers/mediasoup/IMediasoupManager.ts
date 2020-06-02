import {DtlsParameters, RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {
  ConsumerOptions,
  MediaAttributes,
  ProducerOptions,
  RouterOptions,
  TransportOptions,
} from 'entities/Mediasoup';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<RouterOptions>;

  abstract createTransport(
    roomId: string,
    mediaAttributes: MediaAttributes,
  ): Promise<TransportOptions>;

  abstract connectTransport(
    roomId: string,
    dtlsParameters: DtlsParameters,
    mediaAttributes: MediaAttributes,
  ): Promise<void>;

  abstract createProducer(
    transportId: string,
    roomId: string,
    userId: string,
    rtpParameters: RtpParameters,
  ): Promise<ProducerOptions>;

  abstract createConsumer(
    producerId: string,
    roomId: string,
    rtpCapabilities: RtpCapabilities,
  ): Promise<ConsumerOptions>;

  abstract findRouter(roomId: string): Promise<RouterOptions>;

  abstract findProducer(roomId: string, userId: string): Promise<ProducerOptions>;
}
