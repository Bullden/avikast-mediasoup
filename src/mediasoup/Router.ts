import {types} from 'mediasoup';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';

export default class Router {
  constructor(mediasoup: IMediasoupInternal, private readonly instance: types.Router) {}

  public get rtpCapabilities(): types.RtpCapabilities {
    return this.instance.rtpCapabilities;
  }

  public get getRouter(): types.Router {
    return this.instance;
  }
}
