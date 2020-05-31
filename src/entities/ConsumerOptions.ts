import {RtpParameters} from 'mediasoup/lib/types';

export default interface ConsumerOptions {
  id: string;
  producerId: string;
  rtpParameters: RtpParameters;
}
