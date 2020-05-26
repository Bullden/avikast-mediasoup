import IMediasoupManager from 'managers/mediasoup/IMediasoupManager';
import {Injectable} from '@nestjs/common';
import IMediasoup from 'mediasoup/IMediasoup';

@Injectable()
export default class MediasoupManager extends IMediasoupManager {
  constructor(private readonly mediasoup: IMediasoup) {
    super();
  }

  async createRouter() {
    await this.mediasoup.createRouter();
  }
}
