import { LogType } from '@palico-ai/common';
import { LogQueue } from './log_queue';

export class Logger {
  private static tryToSerialize = (obj: unknown) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return obj;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static chainMessage(message: string, ...optionalParams: any[]) {
    return optionalParams.reduce((acc, param) => {
      return `${acc} ${Logger.tryToSerialize(param)}`;
    }, Logger.tryToSerialize(message));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static log(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.Log,
      message: this.chainMessage(message, ...optionalParams),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.ERROR,
      message: this.chainMessage(message, ...optionalParams),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.WARNING,
      message: this.chainMessage(message, ...optionalParams),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static info(message: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.INFO,
      message: this.chainMessage(message, ...optionalParams),
    });
  }
}
