import {RtpParameters, MediaKind} from 'mediasoup/lib/RtpParameters';

export default interface ProducerOptions {
  roomId: string;
  producerId: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
}
