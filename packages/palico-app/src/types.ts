import {
  AgentRequestContent,
  AgentResponse,
} from '@palico-ai/common';

export interface Dataset<Schema=unknown, FetchParams=unknown> {
  fetch: (params?: FetchParams) => Promise<Schema[]>;
}

export { AgentRequestContent, AgentResponse };
