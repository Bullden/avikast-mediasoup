import Router from './Router';

export default abstract class IMediasoup {
  abstract createRouter(roomId: string): Promise<Router>;

  abstract findRouterByRoomId(roomId: string): Router | undefined;
}
