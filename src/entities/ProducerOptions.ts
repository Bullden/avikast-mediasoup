import {RtpParameters, MediaKind} from 'mediasoup/lib/types';

export default interface ProducerOptions {
  roomId: string;
  producerId: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
}
