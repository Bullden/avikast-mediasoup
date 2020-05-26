import Worker from './Worker';
import IMediasoup from './IMediasoup';
import Mediasoup from './Mediasoup';

export const initializeMediasoup = async (): Promise<IMediasoup> => {
  const worker = await Worker.createWorker();
  return new Mediasoup([worker]);
};
