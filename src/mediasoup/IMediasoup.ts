import Router from 'mediasoup/Router';

export default abstract class IMediasoup {
  abstract createRouter(roomId: string): Promise<Router>;

  abstract findRouterByRoomId(roomId: string): Router | undefined;

  // abstract findTransportByRoomId(roomId: string): Transport | undefined;
}
