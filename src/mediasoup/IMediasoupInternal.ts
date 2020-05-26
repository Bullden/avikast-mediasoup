import MediasoupConfig from 'mediasoup/MediasoupConfig';

export default interface IMediasoupInternal {
  getConfig(): MediasoupConfig;
}
