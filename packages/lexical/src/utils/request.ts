import { createClient } from "@palico-ai/client-js"
import { useState } from "react";
import { AIAction, AskAgentRequestParams } from "../types";

interface QueryAgentParams {
  apiURL: string
  serviceKey: string
}

export const useQueryAgent = (params: QueryAgentParams) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const agent = createClient({
    apiURL: params.apiURL,
    serviceKey: params.serviceKey
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const askAgent = async (query: string, context: Record<string, any>) => {
    setLoading(true);
    try {
      const response = await agent.newConversation({
        message: query,
        context
      });
      if(response.message.role !== "assistant") {
        throw new Error("Invalid response from agent");
      }
      setAgentResponse(response.message.content as string);
      return response;
    } catch (error) {
      if(error instanceof Error) {
        setErrorMessage(error.message || "An error occurred while querying the agent");
      }else {
        setErrorMessage("An error occurred while querying the agent");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    askAgent,
    agentResponse,
    loading,
    errorMessage
  }
}

export interface DefaultRequestParams {
  action: AIAction
  selectedOptionValue?: string
  selectedText?: string
  freeText?: string
}

export const getDefaultRequestParams = (params: DefaultRequestParams) : AskAgentRequestParams => {
  return {
    message: params.freeText || "",
    context: {
      action: params.action.name,
      payload: {
        selectedOptionValue: params.selectedOptionValue,
        selectedText: params.selectedText,
        freeText: params.freeText
      }
    }
  }
}

export const getRequestParamForAction = async (params: DefaultRequestParams) : Promise<AskAgentRequestParams> => {
  if(params.action.formatAPIRequest) {
    const body = await params.action.formatAPIRequest({
      selectedOptionValue: params.selectedOptionValue,
      selectedText: params.selectedText,
      freeText: params.freeText
    })
    return body;
  }
  return getDefaultRequestParams(params);
}