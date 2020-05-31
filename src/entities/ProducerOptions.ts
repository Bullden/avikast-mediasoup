import {RtpParameters, MediaKind} from 'mediasoup/lib/types';

export default interface ProducerOptions {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
}
