/* eslint-disable global-require */
import IRecordService from 'services/record/IRecordSevice';
import Worker from 'mediasoup/Worker';
import Router from 'mediasoup/Router';
import {FfmpegCommand} from 'fluent-ffmpeg';
import Consumer from 'mediasoup/Consumer';

export default class RecordService extends IRecordService {
  constructor(
    private readonly router: Router,
    private readonly worker: Worker,
    private ffmpeg: FfmpegCommand,
  ) {
    // const child_process = require('child_process');
    // const {EventEmitter} = require('events');
    // const shell = require('shelljs');

    // const FfmpegCommand = require('fluent-ffmpeg');
    // const command: FfmpegCommand = new FfmpegCommand();
    super();
  }

  // async startRecording(roomId: string, track: unknown, consumer: Consumer) {
  //   const router = await this.worker.findRouter(roomId);
  //   const recordName = Date.now();
  //   const plainTransport = await router.createPlainTransport({roomId});
  //   await plainTransport.createConsumer();
  //   await this.ffmpeg.input(consumer);
  //   // const command = this.ffmpeg({option: 'value', source: Router})
  //   //   .input(`/path/recording/input/input-vp8.sdp`)
  //   //   .output(`/path/recording/output/${recordName}.avi`)
  //   //   .withNoAudio();
  // }

  // async stopRecording() {
  //   console.log('start recording');
  // }
}
