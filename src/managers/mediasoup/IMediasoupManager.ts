import Router from 'entities/Router';
import TransportOptions from '../../entities/TransportOptions';

export default abstract class IMediasoupManager {
  abstract createRouter(roomId: string): Promise<Router>;

  abstract createTransport(roomId: string): Promise<TransportOptions>;
}
