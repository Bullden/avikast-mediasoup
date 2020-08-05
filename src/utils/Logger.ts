/* eslint-disable */
import ILogger from 'utils/ILogger';
import Router from "mediasoup/Router";
import Transport from "mediasoup/Transport";
import WebRtcTransport from "mediasoup/WebRtcTransport";

export default class Logger extends ILogger {
  log(request: string) {
  }

  logRouterCreated(router: Router) {
    console.log("Router created: ", Logger.stringifyRouter(router));
  }

  logWebRtcTransportCreated(transport: WebRtcTransport, router: Router) {
    console.log(`${JSON.stringify({routerId: router.id})} Transport created: `, Logger.stringifyWebRtcTransport(transport))
  }

  routerLog(message: string, info: string) {
    console.log(`${message} ${info}`);
  }

  producerLog(message: string, info: string) {
    console.log(`${message} ${info}`);
  }

  consumerLog(message: string, info: string) {
    console.log(`${message} ${info}`);
  }

  transportLog(message: string, info: string) {
    console.log(`${message} ${info}`);
  }

  private static stringifyRouter(router: Router) {
    return `Router ${JSON.stringify({id: router.id, roomId: router.roomId})}`
  }

  private static stringifyWebRtcTransport(transport: WebRtcTransport) {
    return `Transport ${JSON.stringify({
      roomId: transport.roomId,
      userId: transport.userId,
      direction: transport.direction,
      clientId: transport.clientId,})}`
  }
}
