import {createWorker} from 'mediasoup';
import IMediasoup from './IMediasoup';
import Worker from './Worker';
import MediasoupConfig from 'mediasoup/MediasoupConfig';
import IMediasoupInternal from 'mediasoup/IMediasoupInternal';
import {DtlsParameters, Router, Transport} from 'mediasoup/lib/types';

export default class Mediasoup extends IMediasoup implements IMediasoupInternal {
  private readonly workers: Array<Worker> = [];

  private readonly routers: Map<string, Router>;

  constructor(private readonly config: MediasoupConfig) {
    super();
  }

  private findBestWorker(): Worker {
    const worker = this.workers[0];
    if (!worker) throw new Error('worker not exists');
    return worker;
  }

  public async createWorker() {
    const worker = new Worker(this, await createWorker());
    this.workers.push(worker);
    return worker;
  }

  public async createRouter() {
    const router = this.findBestWorker().createRouter();
    if (!router) throw new Error('no router!');
    this.routers.set('test', router);
    return router;
  }

  public async createTransport(name: string) {
    const router = this.routers.get(name);
    const config = this.getConfig();
    const transport = await router.createWebRtcTransport({
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      listenIps: config.listenIps,
      initialAvailableOutgoingBitrate: config.initialAvailableOutgoingBitrate,
      appData: {name},
    });
    const {id, iceCandidates, iceParameters, dtlsParameters} = transport;
    return {id, iceCandidates, iceParameters, dtlsParameters};
  }

  public async connectTransport(dtlsParameters: DtlsParameters, transport: Transport) {
    await transport.connect({dtlsParameters});
  }

  getConfig(): MediasoupConfig {
    return this.config;
  }
}
