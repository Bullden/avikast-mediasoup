export default abstract class Logger {
  abstract log(request: string): void;

  abstract routerLog(message: string, info: string): void;

  abstract transportLog(message: string, info: string): string;

  abstract producerLog(message: string, info: string): string;

  abstract consumerLog(message: string, info: string): string;
}
