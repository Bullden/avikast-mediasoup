import IMediasoup from './IMediasoup';
import Mediasoup from './Mediasoup';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import {mediaCodecs} from 'config/MediaCodecs';
import {initialAvailableOutgoingBitrate} from 'config/InitialAvailableOutgoingBitrate';
import {TransportListenIp} from 'mediasoup/lib/types';
import {IConfigService} from '@spryrocks/config-node';

export const initializeMediasoup = async (
  configService: IConfigService,
): Promise<IMediasoup> => {
  const listenIps: Array<TransportListenIp> = [{ip: configService.get('LISTEN_IP')}];

  const config: MediasoupConfig = {
    mediaCodecs,
    initialAvailableOutgoingBitrate,
    listenIps,
  };
  const mediasoup = new Mediasoup(config);
  await mediasoup.createWorker();
  return mediasoup;
};
