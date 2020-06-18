/* eslint-disable class-methods-use-this */
import ILogger from 'utils/ILogger';

export default class Logger extends ILogger {
  log(request: string) {
    return request;
  }

  routerLog(message: string, info: string) {
    return `${message} ${info}`;
  }

  producerLog(message: string, info: string) {
    return `${message} ${info}`;
  }

  consumerLog(message: string, info: string) {
    return `${message} ${info}`;
  }

  transportLog(message: string, info: string) {
    return `${message} ${info}`;
  }
}
