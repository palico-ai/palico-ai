import { Action } from "./action_prompts";
import * as zod from 'zod'

export interface PayloadCommon {
  selectedOptionValue?: string;
  selectedText?: string;
  freeText?: string;
}

export interface DefaultContext<Payload = PayloadCommon> {
  action: Action;
  payload: Payload;
}

export interface PromptParams<Payload = PayloadCommon> {
  context: DefaultContext<Payload>;
}

export type ActionPromptFN<Payload = PayloadCommon> = (
  query: string,
  params: PromptParams<Payload>
) => string;

export interface EditorComponentExample<T = any>{
  description?: string;
  value: T;
}

export interface EditorComponent<T=any> {
  name: string;
  description?: string;
  schema: zod.ZodObject<any, any>; // Format: { type: string, value: T}
  examples?: EditorComponentExample<T>[];
}
