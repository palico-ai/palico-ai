import { SimpleApplicationConfig } from "@palico-ai/app";
import { AppPromptBuilder } from "./prompt";
import * as dotenv from "dotenv";
dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey || openaiApiKey === "") {
  throw new Error("OpenAI API Key not found. Please set OPENAI_API_KEY in your environment.");
}

const model = process.env.OPENAI_MODEL ?? "gpt-3.5-turbo-0125";

const config: SimpleApplicationConfig = {
  model,
  openaiApiKey,
  promptBuilder: new AppPromptBuilder(),
};

export default config;