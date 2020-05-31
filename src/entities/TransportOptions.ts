import {DtlsParameters, IceCandidate, IceParameters} from 'mediasoup/lib/types';

export default interface TransportOptions {
  id: string;
  iceCandidates: IceCandidate[];
  iceParameters: IceParameters;
  dtlsParameters: DtlsParameters;
}
