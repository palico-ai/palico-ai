import { PromptParamsCommon, PromptBuilder } from "@palico-ai/app";
import EditorNodeSchemas from "./editor_nodes";
import zodToJsonSchema from "zod-to-json-schema";
import actionPrompts from "./action_prompts";
import { EditorComponent, PromptParams } from "./types";
import { LLMRules } from "./rules";

export class AppPromptBuilder implements PromptBuilder {
  private getPromptForComponent(component: EditorComponent) {
    const schema = zodToJsonSchema(component.schema);
    let prompt = `Component: ${component.name}\n`;
    if (component.description) {
      prompt += `Description: ${component.description}\n`;
    }
    prompt += `Schema: \n${JSON.stringify(schema, null, 2)}\n`;
    if (component.examples) {
      prompt += `Examples: \n`;
      component.examples.forEach((example) => {
        const entry = { type: component.name, value: example.value };
        if (example.description) {
          prompt += `Description: ${example.description} \n
          ${JSON.stringify(entry, null, 2)}\n`;
        } else {
          prompt += `${JSON.stringify(entry, null, 2)}\n`;
        }
        prompt += "----------------\n";
      });
    }
    return prompt;
  }

  async getSystemPrompt(_: PromptParamsCommon): Promise<string> {
    const componentSchemas = EditorNodeSchemas.map(
      this.getPromptForComponent
    ).join("\n-------------\n");
    const rules = LLMRules.map((rule, index) => `${index + 1}. ${rule}`).join(`\n`);
    return `You're a helpful writing assistant. 
    ========================
    You MUST ALWAYS RESPOND WITH A VALID JSON ARRAY, EVEN IF IT HAS A SINGLE ITEM. For example:
      [
        { "type": "some_type", "value": "some_value"},
      ]
    The array can only contain objects with a "type" and "value" property that matches the following schemas:
    ${componentSchemas}
    ========================
    You MUST also following the following rules:
    ${rules}`;
  }

  async getPromptForQuery(
    query: string,
    _params: PromptParamsCommon
  ): Promise<string> {
    const params = _params as unknown as PromptParams;

    const context = params.context;
    const { action } = context;

    const handler = actionPrompts[action];
    if (!handler) {
      throw new Error(`No handler for action: ${action}`);
    }

    return handler(query, params);
  }
}
