import { AppScriptTemplate, JSONAbleObject } from '@palico-ai/common';

export abstract class AppScript<Input extends JSONAbleObject = JSONAbleObject> {
  /**
   * Sample Templates that can be used to run the script from Palico Studio
   */
  templates: AppScriptTemplate<JSONAbleObject>[] = [];

  /**
   * How to run the script
   * @param input input passed to the script
   */
  public abstract run(input: Input): Promise<void>;
}
