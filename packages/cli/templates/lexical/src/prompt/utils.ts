import * as zod from 'zod'
import { EditorComponent, EditorComponentExample } from "./types";

export class EditorComponentBuilder {
  readonly type: string;
  description?: string;
  valueSchema?: zod.ZodSchema<any>
  examples: EditorComponentExample[]

  constructor(type: string) {
    this.type = type;
    this.examples = [];
  }

  setDesc(description: string) {
    this.description = description;
    return this;
  }

  setValueSchema(schema: zod.ZodSchema<any>) {
    this.valueSchema = schema;
    return this;
  }

  addExample(value: any) {
    if(!this.valueSchema) throw new Error("Value schema must be set before adding examples");
    this.valueSchema.parse(value);
    this.examples.push({
      value
    });
    return this;
  }

  addExampleWithDescription(description: string, value: any) {
    if(!this.valueSchema) throw new Error("Value schema must be set before adding examples");
    this.valueSchema.parse(value);
    this.examples.push({
      description,
      value
    });
    return this;
  }

  build() : EditorComponent{
    if(!this.valueSchema) throw new Error("Value schema must be set before building");
    return {
      name: this.type,
      description: this.description,
      schema: zod.object({
        type: zod.literal(this.type),
        value: this.valueSchema
      }),
      examples: this.examples
    }
  }
}