import { JSONAbleObject } from '@palico-ai/common';
import { getTracer } from '../tracing';
import AppScriptModel from './model';

export interface AppScriptRunParams {
  scriptName: string;
  requestId: string;
  input: JSONAbleObject;
}

const tracer = getTracer('AppScriptExecutor');

export default class AppScriptExecutor {
  static async run(params: AppScriptRunParams): Promise<void> {
    return await tracer.trace('AppScriptExecutor->run', async (runSpan) => {
      try {
        runSpan.setAttributes({
          scriptName: params.scriptName,
          params: JSON.stringify(params.input, null, 2),
        });
        const script = await AppScriptModel.getByName(params.scriptName);
        await script.run(params.input);
      } catch (e) {
        console.log('Error in AppScriptExecutor.run', e);
        runSpan.setStatus({
          code: 2,
          message: e instanceof Error ? e.message : 'An error occurred',
        });
        throw e;
      }
    });
  }
}
