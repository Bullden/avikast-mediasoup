import {DtlsParameters} from 'mediasoup/lib/WebRtcTransport';

export type ConnectTransportPattern = {
  area: 'transport';
  action: 'connect';
};

export interface ConnectTransportRequest {
  roomId: string;
  dtlsParameters: DtlsParameters;
}

export interface ConnectTransportResponse {
  result: boolean;
}
