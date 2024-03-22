import { ActionPromptFN } from "./types";

export enum Action {
  AskAIToWrite = "ask_ai_to_write",
  CreateBlogPost = "create_blog_post",
  SummarizeText = "generate_summary",
  TranslateText = "translate_section",
  FixGrammerAndSpelling = "fix_grammar_and_spelling"
}

// =============================================================================

const createBlogPostPrompt: ActionPromptFN = (query, params) => {
  const { freeText } = params.context.payload;
  const userPrompt = query ?? freeText;
  if (!userPrompt || userPrompt.length === 0) {
    throw new Error("Prompt not specified");
  }
  return `Create a lengthy blogpost about: ${query}`;
};

const askAIToWritePrompt: ActionPromptFN = (query, params) => {
  const { selectedText, freeText } = params.context.payload;
  const userPrompt = query ?? freeText;
  if (!userPrompt || userPrompt.length === 0) {
    throw new Error("Prompt not specified");
  }
  if (selectedText) {
    return `
    Context:
    ${selectedText}
    ------
    ${userPrompt}
    `;
  }
  return `You are asked to write about: ${query}`;
};

const summarizeTextPrompt: ActionPromptFN = (_, params) => {
  const { selectedText } = params.context.payload;
  if (!selectedText) {
    throw new Error("Text to summarize not specified");
  }
  return `DO NOT USE ANY HEADINGS. Rephrase and summarize the following text:
  ${selectedText}`;
};

const translateTextPrompt: ActionPromptFN = (_, params) => {
  const { selectedText, selectedOptionValue } = params.context.payload;
  if (!selectedOptionValue) {
    throw new Error("Language not specified");
  }
  if (!selectedText) {
    throw new Error("Text to translate not specified");
  }
  return `Translate the following text to ${selectedOptionValue}:
  ${selectedText}
  `;
};

const fixGrammerAndSpellingPrompt: ActionPromptFN = (_, params) => {
  const { selectedText } = params.context.payload;
  if (!selectedText) {
    throw new Error("Text to fix grammar and spelling not specified");
  }
  return `Fix grammar and spelling in the following text:
  ${selectedText}`;
};

// =============================================================================

const actionPrompts: Record<Action, ActionPromptFN> = {
  [Action.AskAIToWrite]: askAIToWritePrompt,
  [Action.CreateBlogPost]: createBlogPostPrompt,
  [Action.SummarizeText]: summarizeTextPrompt,
  [Action.TranslateText]: translateTextPrompt,
  [Action.FixGrammerAndSpelling]: fixGrammerAndSpellingPrompt,
};

export default actionPrompts;
