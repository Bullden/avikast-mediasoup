/* eslint-disable global-require,@typescript-eslint/no-unused-vars,no-console,@typescript-eslint/ban-ts-ignore */
import IRecordService from 'services/record/IRecordSevice';
import Worker from 'mediasoup/Worker';
import Router from 'mediasoup/Router';
import Consumer from 'mediasoup/Consumer';
import {RtpParameters} from 'mediasoup/lib/RtpParameters';
import {ChildProcess} from 'child_process';
import {getProjectRoot} from 'utils/FileSystemUtils';

export default class RecordService extends IRecordService {
  private readonly processes: Map<string, ChildProcess> = new Map();

  private readonly configDirectory: string;

  constructor(private readonly recordingsDirectory: string) {
    super();
    this.configDirectory = `${getProjectRoot()}/config`;
  }

  async startRecording(
    roomId: string,
    userId: string,
    producerId: string,
    consumer: Consumer,
  ) {
    const process = require('child_process');
    this.processes.set(roomId, process);
    // @ts-ignore
    let recResolve;
    const promise = new Promise((res) => {
      recResolve = res;
    });
    const audio = true;
    const video = true;
    const h264 = true;
    // TODO set vp8
    let cmdInputPath = `${this.configDirectory}/input-h264.sdp`;
    let cmdOutputPath = `${this.recordingsDirectory}/output-ffmpeg-vp8.webm`;
    let cmdCodec = '';
    let cmdFormat = '-f webm -flags +global_header';
    const ffmpegOut = process.execSync('ffmpeg -version', {encoding: 'utf8'});
    const ffmpegVerMatch = /ffmpeg version (\d+)\.(\d+)\.(\d+)/.exec(ffmpegOut);
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    let ffmpegOk = false;
    if (ffmpegOut.startsWith('ffmpeg version git')) {
      ffmpegOk = true;
    } else if (ffmpegVerMatch) {
      const ffmpegVerMajor = parseInt(ffmpegVerMatch[1], 10);
      const ffmpegVerMinor = parseInt(ffmpegVerMatch[2], 10);
      const ffmpegVerPatch = parseInt(ffmpegVerMatch[3], 10);
      if (ffmpegVerMajor >= 4 && ffmpegVerMinor >= 0 && ffmpegVerPatch >= 0) {
        ffmpegOk = true;
      }
    }
    if (false) {
      console.error('FFmpeg >= 4.0.0 not found in $PATH; please install it');
      process.exit(1);
    }
    if (audio) {
      cmdCodec += ' -map 0:a:0 -c:a copy';
    }
    if (video) {
      cmdCodec += ' -map 0:v:0 -c:v copy';

      if (h264) {
        cmdInputPath = `${this.configDirectory}/input-h264.sdp`;
        cmdOutputPath = `${this.recordingsDirectory}/${year}.${month}.${day}-${hour}:${minute}:${second}vp8.avi`;
        cmdFormat = '-f mp4 -strict experimental';
      }
    }
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

    const recProcess = process.spawn(cmdProgram, cmdArgStr.split(/\s+/));
    this.processes.set(roomId, recProcess);
    // setTimeout(() => {
    //   recProcess.kill('SIGINT');
    //   console.log('process kill');
    // }, 10000);
    // @ts-ignore
    recProcess.stderr.on('data', (chunk) => {
      chunk
        .toString()
        .split(/\r?\n/g)
        .filter(Boolean)
        // @ts-ignore
        .forEach((line) => {
          console.log(line);
          if (line.startsWith('ffmpeg version')) {
            setTimeout(() => {
              // @ts-ignore
              recResolve();
            }, 1000);
          }
        });
    });
    await recResolve;
    return true;
  }

  async stopRecording(roomId: string) {
    console.log(roomId);
    const process = this.processes.get(roomId);
    if (!process) throw new Error(`There is now such a process with room id ${roomId}`);
    process.kill('SIGINT');
    return true;
  }
}
