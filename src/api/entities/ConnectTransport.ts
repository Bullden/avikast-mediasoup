import {Direction} from 'entities/Mediasoup';

export type ConnectTransportPattern = {
  area: 'transport';
  action: 'connect';
};

export interface ConnectTransportRequest {
  roomId: string;
  dtlsParameters: object;
  direction: Direction;
  clientId: string;
}

export type ConnectTransportResponse = void;
