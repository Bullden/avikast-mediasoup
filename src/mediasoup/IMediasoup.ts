import Router from './Router';
import {Filter} from 'mediasoup/Utils';

export default abstract class IMediasoup {
  abstract createRouter(roomId: string): Promise<Router>;

  abstract findRouter(filter: Filter): Router | undefined;
}
