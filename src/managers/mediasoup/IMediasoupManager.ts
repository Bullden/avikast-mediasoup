import Router from 'entities/Router';

export default abstract class IMediasoupManager {
  abstract createRouter(): Promise<Router>;
}
