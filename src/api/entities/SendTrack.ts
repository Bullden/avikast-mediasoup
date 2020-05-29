import {RtpParameters} from 'mediasoup/lib/RtpParameters';

export type SendTrackPattern = {
  area: 'track';
  action: 'send';
};

export interface SendTrackRequest {
  transportId: string;
  roomId: string;
  kind: string;
  rtpParameters: RtpParameters;
}

export interface SendTrackResponse {
  producerId: string;
}
