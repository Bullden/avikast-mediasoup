import IMediasoup from './IMediasoup';
import Mediasoup from './Mediasoup';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import {mediaCodecs} from 'config/MediaCodecs';

export const initializeMediasoup = async (): Promise<IMediasoup> => {
  const config: MediasoupConfig = {
    mediaCodecs,
  };
  const mediasoup = new Mediasoup(config);
  await mediasoup.createWorker();
  return mediasoup;
};
