import { EvalTestCaseResult } from '@palico-ai/common';

export const EVAL_RESULT_ACCESSOR_KEYS = {
  userMessage: 'input.userMessage',
  payload: 'input.payload',
  response: 'output.message',
  data: 'output.data',
  conversationId: 'output.conversationId',
  tag: (tag: string) => `tags.${tag}`,
  metric: (metric: string) => `metrics.${metric}`,
};

export const ANALYSIS_TABLE_COL_ID = {
  label: 'label',
  userMessage: 'userMessage',
  payload: 'payload',
  response: 'response',
  responseData: 'responseData',
  conversationId: 'conversationId',
  tag: (tag: string) => `tag.${tag}`,
  metric: (metric: string) => `metric.${metric}`,
};

export const getAllMetrics = (data: EvalTestCaseResult[]) => {
  const metrics = new Set<string>();
  data.forEach((item) => {
    Object.keys(item.metrics).forEach((key) => {
      metrics.add(key);
    });
  });
  return Array.from(metrics);
};

export const getAllTags = (data: EvalTestCaseResult[]) => {
  const tags = new Set<string>();
  data.forEach((item) => {
    Object.keys(item.tags).forEach((key) => {
      tags.add(key);
    });
  });
  return Array.from(tags);
};
