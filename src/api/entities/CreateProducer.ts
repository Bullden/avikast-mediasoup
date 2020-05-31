export type CreateProducerPattern = {
  area: 'producer';
  action: 'create';
};

export interface CreateProducerRequest {
  transportId: string;
  roomId: string;
  kind: string;
  rtpParameters: object;
}

export interface CreateProducerResponse {
  producerId: string;
}
