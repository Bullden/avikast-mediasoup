import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';

export default class Transport {
  constructor(
    mediasoup: IMediasoupInternal,
    private readonly instance: types.Transport,
  ) {}
}
