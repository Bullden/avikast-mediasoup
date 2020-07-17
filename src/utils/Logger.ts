/* eslint-disable */
import ILogger from 'utils/ILogger';

export default class Logger extends ILogger {
  log(request: string) {
    console.log(request);
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
}
