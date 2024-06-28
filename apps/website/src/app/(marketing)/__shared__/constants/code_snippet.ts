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
