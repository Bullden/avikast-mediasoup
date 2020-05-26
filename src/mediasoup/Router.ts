import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';

export default class Router {
  constructor(mediasoup: IMediasoupInternal, private readonly instance: types.Router) {}
}
