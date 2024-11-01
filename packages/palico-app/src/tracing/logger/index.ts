import { LogType } from '@palico-ai/common';
import { LogQueue } from './log_queue';

const tryToSerialize = (obj: unknown) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return obj;
  }
};

const chainMessage = (message: string, ...optionalParams: any[]) => {
  return optionalParams.reduce((acc, param) => {
    return `${acc} ${tryToSerialize(param)}`;
  }, tryToSerialize(message));
};

export const logger = {
  log: (message: any, ...optionalParams: any[]) => {
    console.log(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.Log,
      message: chainMessage(message, ...optionalParams),
    });
  },
  error: (message: any, ...optionalParams: any[]) => {
    console.error(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.ERROR,
      message: chainMessage(message, ...optionalParams),
    });
  },
  warn: (message: any, ...optionalParams: any[]) => {
    console.warn(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.WARNING,
      message: chainMessage(message, ...optionalParams),
    });
  },
  info: (message: any, ...optionalParams: any[]) => {
    console.info(message, ...optionalParams);
    LogQueue.enqueueLog({
      logType: LogType.INFO,
      message: chainMessage(message, ...optionalParams),
    });
  },
};
