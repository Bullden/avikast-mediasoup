import Router from 'mediasoup/Router';
import WebRtcTransport from 'mediasoup/WebRtcTransport';

export default abstract class Logger {
  abstract logRouterCreated(router: Router): void;

  abstract logWebRtcTransportCreated(transport: WebRtcTransport, router: Router): void;

  abstract log(request: string): void;

  abstract routerLog(message: string, info: string): void;

  abstract producerLog(message: string, info: string): void;

  abstract consumerLog(message: string, info: string): void;
}
