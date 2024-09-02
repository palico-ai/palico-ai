const chatWrapperCodeSnippet = (content: string) => `async function chat(
  content: ConversationRequestContent,
  context: ConversationContext
): Promise<AgentResponse> {
  ${content}
}
`;

export const simpleAgentCodeSnippet = `class MyLLMApplication implements Agent {
  async chat(content, context) {
    const { userMessage, payload } = content;
    // build your prompt
    // call an llm model
    // post processing
    return {
      message: "...",
      data: "..."
    }
  }
}
`;

export const agentCodeSnippets = `class MathTutorLLMAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    const {
      model,
      promptStrategy,
      ragPipelineVersion,
    } = context.appConfig // build different variations of your agent

    const prompt = await MathTutorAgent.createPrompt(
      content.userMessage, // user message from the client
      content.payload, // additional data passed from the client
      promptStrategy,
      ragPipelineVersion
    );

    const response = await OpenAIService.newConversation({
      conversationId: context.conversationId,
      message: prompt,
      model,
    });

    return {
      message: response.message,
      data: {
        // ...any additional data you want to return to the client
      },
    };
  }
}
`;

export const appConfigCodeSnippet = chatWrapperCodeSnippet(`
  const {
    model,
    promptStrategy,
    // ...any other configuration you want to use
  } = context.appConfig

  // Your own logic to create a prompt, call LLM, business logic, etc.
  const { userMessage } = content;
  const prompt = await createPrompt(
    promptStrategy, userMessage
  );
  const response = openai.chat.completions.create({
    messages: prompt,
    model: model,
  })

  return {
    message: response.message,
  }`);

export const portkeyCodeSnippet =
  `import Portkey from 'portkey-ai';\n\n` +
  chatWrapperCodeSnippet(`
  const response = await portkey.chat.completions.create({
    model: context.appConfig.model,
    messages: createMessage(...),
  });

  return {
    message: response.message,
  }`);

export const langchainCodeSnippet =
  `import { ChatOpenAI } from "@langchain/openai"\nimport { HumanMessage } from "@langchain/core/messages"\n\n` +
  chatWrapperCodeSnippet(`
  const model = new ChatOpenAI({
    model: context.appConfig.model,
    temperature: 0
  });

  const response = await model.invoke([
    new HumanMessage({ content: content.userMessage })
  ]);

  return {
    message: response.message,
  }`);

export const pineconeCodeSnippet =
  `import { Pinecone } from "@pinecone-database/pinecone";\n\n` +
  chatWrapperCodeSnippet(`
  const pinecone = new Pinecone({apiKey: "...",});

  const promptContext = await pinecone.similaritySearch(
    content.userMessage, 5
  );

  const response = await openai.chat.completions.create({
    messages: createMessage(content.userMessage, promptContext),
    model: context.appConfig.model,
  });

  return {
    message: response.message,
  }`);

export const workflowCodeSnippets = `ChainWorkflow
  .create("Categorize Question", async (input, context) => {
  // ... call the categorization agent
  })
  .link("Identify Tutor Agent", async (input, context) => {
    // ... business logic to identify the tutor agent
  })
  .link("Call LLM Agent", async (input, context) => {
    // ... call the right LLM agent
  })
  .send(async (input, context) => {
    return {
      message: input.agent.message,
      data: input.agent.data,
    };
  });
`;

export const callAgentWithAppConfig = (options: {
  model: string;
  prompt: string;
  dataset: string;
  postProcess: boolean;
}) => {
  return `palico.agents.newConversation({
  name: "MyApp",
  // swapping configuration
  appConfig: {
    model: "${options.model}",
    prompt: "${options.prompt}",
    dataset: "${options.dataset}",
    postProcess: ${options.postProcess},
  },
  userMessage: "...",
  payload: {...},
});`;
};
