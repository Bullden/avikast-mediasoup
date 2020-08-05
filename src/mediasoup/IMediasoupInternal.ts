import MediasoupConfig from 'mediasoup/MediasoupConfig';

export default interface IMediasoupInternal {
  getConfig(): MediasoupConfig;
  removeTransport(roomId: string, transportId: string): void;
}
