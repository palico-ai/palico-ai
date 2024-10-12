import { AppConfig } from '.';

export type RequestTemplate<
  TemplateSchema extends JSONAbleObject = JSONAbleObject
> = {
  name: string;
  template: TemplateSchema;
};

export type JSONAbleObject<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  KV extends Record<string, any> = Record<string, any>
> = KV;

export type InputWithAppConfig<
  Input extends JSONAbleObject = JSONAbleObject,
  AC extends JSONAbleObject = AppConfig
> = {
  input: Input;
  appConfig?: AC;
};

export enum QueueJobStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  FAILED = 'failed',
  SUCCESS = 'success',
}
