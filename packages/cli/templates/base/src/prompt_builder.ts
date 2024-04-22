import { PromptParamsCommon, PromptBuilder } from "@palico-ai/app/src/__old";

export class AppPromptBuilder implements PromptBuilder {
  async getSystemPrompt(params: PromptParamsCommon): Promise<string> {
    return `You're a helpful assistant`
  }

  async getPromptForQuery(query: string, params: PromptParamsCommon): Promise<string>  {
    return query
  }
}