import {RtpCodecCapability} from 'mediasoup/lib/types';

export default interface MediasoupConfig {
  mediaCodecs: Array<RtpCodecCapability>;
}
