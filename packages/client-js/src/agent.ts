import { AgentResponse, AgentResponseStreamReader } from '@palico-ai/common';
import { createAPIClient } from './request';
import {
  ChatRequestParams,
  ChatRequestParamsWithStream,
  CreateClientParams,
} from './types';

export const agent = (config: CreateClientParams) => {
  const { apiURL, serviceKey } = config;
  const { fetch } = createAPIClient({ rootURL: apiURL, serviceKey });

  function chat(params: ChatRequestParams): Promise<AgentResponse>;
  function chat(
    params: ChatRequestParamsWithStream
  ): Promise<AgentResponseStreamReader>;
  function chat(
    params: ChatRequestParams | ChatRequestParamsWithStream
  ): Promise<AgentResponse | AgentResponseStreamReader>;
  // implementation of the overloaded function
  async function chat(
    params: ChatRequestParams | ChatRequestParamsWithStream
  ): Promise<AgentResponse | AgentResponseStreamReader> {
    const url = params.conversationId
      ? `/agent/${params.agentName}/conversation/${params.conversationId}/reply`
      : `/agent/${params.agentName}/conversation`;
    const response = await fetch(url, {
      method: 'POST',
      body: {
        content: {
          userMessage: params.userMessage,
          payload: params.payload,
          toolCallResults: params.toolCallResults,
        },
        appConfig: params.appConfig ?? {},
        stream: ('stream' in params && params.stream) ?? false,
      },
    });
    if ('stream' in params && params.stream === true) {
      return new AgentResponseStreamReader(response);
    } else {
      const json = await response.json();
      return json as AgentResponse;
    }
  }

  return {
    chat,
  };
};

/**
 * Read a stream of responses from the agent.
 * Useful for calling the agent without the palico-client or,
 * piping <AgentResponseStreamReader>.response through
 * different middleware or systems.
 * @param response HTTP response with a readable stream
 * @returns AgentResponseStreamReader for easier handling of the stream
 */
export const agentStreamReader = (response: Response) =>
  new AgentResponseStreamReader(response);
