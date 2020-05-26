import Router from 'mediasoup/Router';

export default abstract class IMediasoup {
  abstract createRouter(): Promise<Router>;
}
