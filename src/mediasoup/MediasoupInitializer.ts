import IMediasoup from './IMediasoup';
import Mediasoup from './Mediasoup';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import {mediaCodecs} from 'config/MediaCodecs';
import {initialAvailableOutgoingBitrate} from 'config/InitialAvailableOutgoingBitrate';
import {listenIps} from 'config/ListenIps';

export const initializeMediasoup = async (): Promise<IMediasoup> => {
  const config: MediasoupConfig = {
    mediaCodecs,
    initialAvailableOutgoingBitrate,
    listenIps,
  };
  const mediasoup = new Mediasoup(config);
  await mediasoup.createWorker();
  return mediasoup;
};
