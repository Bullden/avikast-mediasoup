import TransportOptions from '../../entities/TransportOptions';

export type CreateTransportPattern = {
  area: 'transport';
  action: 'create';
};

export interface CreateTransportRequest {
  name: string;
}

export interface CreateTransportResponse {
  transportOptions: TransportOptions;
}
