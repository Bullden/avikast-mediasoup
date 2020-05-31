import {RtpParameters} from 'mediasoup/lib/RtpParameters';

export default interface ProducerOptions {
  roomId: string;
  producerId: string;
  kind: string;
  rtpParameters: RtpParameters;
}
