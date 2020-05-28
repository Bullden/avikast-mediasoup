import Router from 'entities/Router';
import TransportOptions from '../../entities/TransportOptions';

export default abstract class IMediasoupManager {
  abstract createRouter(): Promise<Router>;

  abstract createTransport(name: string): Promise<TransportOptions>;
}
