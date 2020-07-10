import {Injectable} from '@nestjs/common';
import IMediaManager from 'managers/media/IMediaManager';
import IMediasoup from 'mediasoup/IMediasoup';
import {RtpCapabilities, RtpParameters} from 'mediasoup/lib/types';
import {MediaKind, MediaType, ProducerOptions} from 'entities/Mediasoup';
import {types} from 'mediasoup';
import ILogger from 'utils/ILogger';
import IRecordService from 'services/record/IRecordSevice';
import {IConfigService} from '@spryrocks/config-node';
import childProcess from 'child_process';

@Injectable()
export default class MediaManager extends IMediaManager {
  constructor(
    private readonly mediasoup: IMediasoup,
    private readonly logger: ILogger,
    private readonly recordService: IRecordService,
    private readonly configService: IConfigService,
  ) {
    super();
  }

  async createRouter(roomId: string) {
    const router = await this.mediasoup.createRouter({roomId});
    this.logger.routerLog('router created with roomId:', router.roomId);
    return router;
  }

  async createTransport(
    roomId: string,
    userId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    let router = await this.mediasoup.findRouter({roomId});
    if (!router) {
      router = await this.mediasoup.createRouter({roomId});
    }
    return router.createWebRtcTransport({
      roomId,
      userId,
      direction,
      clientId,
    });
  }

  async createPlainTransport(
    roomId: string,
    userId: string,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    let router = await this.mediasoup.findRouter({roomId});
    if (!router) {
      router = await this.mediasoup.createRouter({roomId});
    }
    const transport = await router.createPlainTransport(
      {
        roomId,
        userId,
        direction,
        clientId,
      },
      this.configService,
    );
    return transport;
  }

  async connectTransport(
    roomId: string,
    dtlsParameters: object,
    direction: 'send' | 'receive',
    clientId: string,
  ) {
    const router = await this.findRouter(roomId);
    const transport = router.findTransport({roomId, direction, clientId});
    if (!transport) throw new Error(`'Transport not found', ${transport}`);
    this.logger.transportLog('transport connected', transport.id);
    await transport.connectToRouter(dtlsParameters as types.DtlsParameters);
  }

  findTransportByRoomId(roomId: string, direction: 'send' | 'receive') {
    const router = this.mediasoup.findRouter({roomId});
    this.logger.transportLog('find transport by room id', roomId);
    if (!router) {
      throw new Error(`findTransportByRoomId cannot find router by roomId ${roomId}`);
    }
    this.logger.transportLog('transport founded', direction);
    return router.findTransport({roomId, direction});
  }

  findTransport(roomId: string, direction: 'send' | 'receive', clientId: string) {
    const router = this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`findTransport cannot find router by roomId ${roomId}`);
    const transport = router.findTransport({
      roomId,
      direction,
      clientId,
    });
    this.logger.transportLog('find transport by room id and client id:', roomId);
    return transport;
  }

  async createProducer(
    roomId: string,
    transportId: string,
    clientId: string,
    userId: string,
    rtpParameters: RtpParameters,
    mediaType: MediaType,
    mediaKind: MediaKind,
  ) {
    const transport = this.findTransport(roomId, 'send', clientId); // todo: refactor
    if (!transport)
      throw new Error(
        `No transport By roomId ${roomId} direction send and clientid ${clientId}`,
      );
    const producer = await transport.createProducer(
      transportId,
      rtpParameters,
      mediaKind,
      {
        roomId,
        clientId,
        userId,
        mediaType,
      },
    );
    this.logger.producerLog('producer created', producer.id);
    return producer;
  }

  async createConsumer(
    roomId: string,
    producerId: string,
    rtpCapabilities: RtpCapabilities,
    clientId: string,
    userId: string,
  ) {
    const transport = this.findTransport(roomId, 'receive', clientId);
    if (!transport)
      throw new Error(`By roomId ${roomId} direction receive and clientid ${clientId}`);

    const consumer = await transport.createConsumer(producerId, rtpCapabilities, {
      roomId,
      clientId,
      userId,
    });
    this.logger.consumerLog('consumer created', consumer.id);
    return consumer;
  }

  async findRouter(roomId: string) {
    let router = this.mediasoup.findRouter({roomId});
    if (!router) router = await this.mediasoup.createRouter({roomId});
    return router;
  }

  async findProducer(roomId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'send');
    if (!transport) throw new Error(`cannot find transport by transport ${transport}`);
    const producer = transport.findProducer({roomId});
    if (!producer) throw new Error(`cannot find producer by userId ${userId}`);
    this.logger.producerLog('producer found', producer.id);
    return producer;
  }

  async getProducers(roomId: string) {
    const router = await this.mediasoup.findRouter({roomId});
    if (!router) throw new Error(`cannot find router by roomId ${router}`);
    const transports = router.getTransports();
    const producers: ProducerOptions[] = [];
    this.logger.producerLog('get producers by roomid:', roomId);
    transports
      .filter((t) => t.dtlsState === 'connected')
      .forEach((transport) => {
        producers.push(...transport.producers);
      });
    this.logger.producerLog('result producers array length:', roomId);
    if (!producers) throw new Error(`no producer on this router.roomId ${router.roomId}`);
    return producers;
  }

  async findConsumer(roomId: string, clientId: string, userId: string) {
    const transport = this.findTransportByRoomId(roomId, 'receive');
    if (!transport)
      throw new Error(`Consumer:cannot find transport by transport ${transport}`);
    const consumer = transport.findConsumer({userId, clientId, roomId});
    if (!consumer)
      throw new Error(`COnsumer: cannot find consumer by clientId ${clientId}`);
    return consumer;
  }

  // eslint-disable-next-line class-methods-use-this
  async startRecord(roomId: string, userId: string, producerId: string) {
    const router = await this.findRouter(roomId);
    router.rtpCapabilities.codecs?.find((c) => c.mimeType === 'video/H264');
    const plainTransport = await router.createPlainTransport(
      {
        roomId,
        userId,
      },
      this.configService,
    );
    await plainTransport.connect('192.168.1.5', 3000, 3005);
    // const oldConsumer = this.findConsumer(roomId, clientId, userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newConsumer = await plainTransport.createConsumer(
      producerId,
      router.rtpCapabilities,
      {
        roomId,
        userId,
      },
    );
    await this.test();
    return true;
    // const codec = global.mediasoup.router.rtpCapabilities.codecs.find(
    //     (c) => c.mimeType === "video/H264"
    // );
    // const cmdInputPath = `${__dirname}/recording/input-h264.sdp`;
    // const cmdOutputPath = `${__dirname}/recording/output-ffmpeg-h264.mp4`;
    // newConsumer;
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  async stopRecord(roomId: string) {
    // console.log('stopRecord', roomId);
  }

  // eslint-disable-next-line class-methods-use-this
  async test() {
    // Return a Promise that can be awaited
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    let recResolve;
    // const promise = new Promise((res) => {
    //   recResolve = res;
    // });

    // const useAudio = audioEnabled();
    // const useVideo = videoEnabled();
    // const useH264 = h264Enabled();

    const cmdInputPath = `/Users/naumenko/git/avikast/avikast-mediasoup/recording/input-vp8.sdp`;
    const cmdOutputPath = `/Users/naumenko/git/avikast/avikast-mediasoup/recording/output-ffmpeg-vp8.webm`;
    let cmdCodec = '';
    const cmdFormat = '-f webm -flags +global_header';

    // Ensure correct FFmpeg version is installed
    const ffmpegOut = childProcess.execSync('ffmpeg -version', {encoding: 'utf8'});
    const ffmpegVerMatch = /ffmpeg version (\d+)\.(\d+)\.(\d+)/.exec(ffmpegOut);
    let ffmpegOk = false;
    if (ffmpegOut.startsWith('ffmpeg version git')) {
      // Accept any Git build (it's up to the developer to ensure that a recent
      // enough version of the FFmpeg source code has been built)
      ffmpegOk = true;
    } else if (ffmpegVerMatch) {
      const ffmpegVerMajor = parseInt(ffmpegVerMatch[1], 10);
      const ffmpegVerMinor = parseInt(ffmpegVerMatch[2], 10);
      const ffmpegVerPatch = parseInt(ffmpegVerMatch[3], 10);
      if (ffmpegVerMajor >= 4 && ffmpegVerMinor >= 0 && ffmpegVerPatch >= 0) {
        ffmpegOk = true;
      }
    }

    if (ffmpegOk) {
      throw new Error('FFmpeg >= 4.0.0 not found in $PATH; please install it');
    }

    cmdCodec += ' -map 0:v:0 -c:v copy';

    // Run process
    const cmdProgram = 'ffmpeg'; // Found through $PATH
    const cmdArgStr = [
      '-nostdin',
      '-protocol_whitelist file,rtp,udp',
      // "-loglevel debug",
      // "-analyzeduration 5M",
      // "-probesize 5M",
      '-fflags +genpts',
      `-i ${cmdInputPath}`,
      cmdCodec,
      cmdFormat,
      `-y ${cmdOutputPath}`,
    ]
      .join(' ')
      .trim();

    const recProcess = childProcess.spawn(cmdProgram, cmdArgStr.split(/\s+/));
    // recProcess.on('error', (err) => {
    //   console.error('Recording process error:', err);
    // });

    // recProcess.on('exit', (code, signal) => {
    //   console.log('Recording process exit, code: %d, signal: %s', code, signal);
    //
    //   global.recProcess = null;
    //   stopMediasoupRtp();
    //
    //   if (!signal || signal === 'SIGINT') {
    //     console.log('Recording stopped');
    //   } else {
    //     console.warn(
    //       "Recording process didn't exit cleanly, output file might be corrupt",
    //     );
    //   }
    // });

    // FFmpeg writes its logs to stderr
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    recProcess.stderr.on('data', (chunk) => {
      chunk
        .toString()
        .split(/\r?\n/g)
        .filter(Boolean) // Filter out empty strings
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        .forEach((line) => {
          if (line.startsWith('ffmpeg version')) {
            setTimeout(() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              recResolve();
            }, 1000);
          }
        });
    });

    // return promise;
  }
}
