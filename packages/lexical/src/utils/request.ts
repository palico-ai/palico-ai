import { AIAction, AskAgentRequestParams } from "../types";

export interface DefaultRequestParams {
  agentId: string
  action: AIAction
  selectedOptionValue?: string
  selectedText?: string
  freeText?: string
}

export const getDefaultRequestParams = (params: DefaultRequestParams) : AskAgentRequestParams => {
  return {
    agentId: params.agentId,
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