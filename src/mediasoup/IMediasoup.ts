import Router from 'mediasoup/Router';
import {DtlsParameters, Transport} from 'mediasoup/lib/types';
import TransportOptions from '../entities/TransportOptions';

export default abstract class IMediasoup {
  abstract createRouter(): Promise<Router>;

  abstract createTransport(name: string): Promise<TransportOptions>;

  abstract connectTransport(
    dtlsParameters: DtlsParameters,
    transport: Transport,
  ): Promise<void>;
}
