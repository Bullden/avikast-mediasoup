export type Direction = 'send' | 'receive';

export type MediaKind = 'audio' | 'video';
export type MediaType = 'camera' | 'screen';

export interface MediaAttributes {
  kind: MediaKind;
  mediaType: MediaType;
  direction: Direction;
}

export interface ConsumerOptions {
  id: string;
  producerId: string;
  rtpParameters: object;
}

export interface RouterOptions {
  rtpCapabilities: object;
}

export interface ProducerOptions {
  id: string;
  kind: MediaKind;
  rtpParameters: object;
  appData: object;
}

export interface TransportOptions {
  id: string;
  iceCandidates: object;
  iceParameters: object;
  dtlsParameters: object;
}
