import { getActiveConversationContext } from '../public.span';
import { LogItem, LogType } from '@palico-ai/common';
import { ConversationTelemetryModel } from '../../services/database/conversation_telemetry';

interface QueueLogParams {
  callerName?: string;
  logType: LogType;
  message: string;
}

export class LogQueue {
  private static requestIdLogs: Record<string, LogItem[]> = {};

  static enqueueLog(params: QueueLogParams) {
    const { callerName, logType, message } = params;
    const context = getActiveConversationContext();
    if (!context?.requestId) {
      return;
    }
    const requestId = context.requestId;
    if (!this.requestIdLogs[requestId]) {
      this.requestIdLogs[requestId] = [];
    }
    this.requestIdLogs[requestId].push({
      callerName,
      type: logType,
      message,
      timestamp: Date.now(),
    });
  }

  static async tryFlushingLogs(requestId: string) {
    try {
      const logs = this.requestIdLogs[requestId];
      if (!logs) {
        console.warn('no logs to flush');
      }
      await ConversationTelemetryModel.saveRequestLogs({
        requestId,
        logs: logs ?? [],
      });
    } catch (e) {
      console.error('error flushing logs', e);
      console.error(e);
    } finally {
      delete this.requestIdLogs[requestId];
    }
  }
}
