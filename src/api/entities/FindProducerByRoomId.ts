import {RtpParameters} from 'mediasoup/lib/RtpParameters';

export type FindProducerByRoomIdPattern = {
  area: 'producer';
  action: 'find';
};

export interface FindProducerByRoomIdRequest {
  roomId: string;
}

export interface FindProducerByRoomIdResponse {
  producerId: string;
  roomId: string;
  kind: string;
  rtpParameters: RtpParameters;
}
