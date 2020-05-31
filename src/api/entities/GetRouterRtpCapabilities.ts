import {RtpCapabilities} from 'mediasoup/lib/RtpParameters';

export type GetRouterCapabilitiesByRoomIdPattern = {
  area: 'router';
  action: 'get';
};

export interface GetRouterCapabilitiesByRoomIdRequest {
  roomId: string;
}

export interface GetRouterCapabilitiesByRoomIdResponse {
  rtpCapabilities: RtpCapabilities;
}
