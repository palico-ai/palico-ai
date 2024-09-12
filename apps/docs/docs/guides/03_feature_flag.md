# Hot-Swap Components

LLM Application by default has a lot of performance issues. You need to be able to test lots of variations of prompts, models, and overall architecture to improve it's performance. To allow you to easily test different variations of your LLM application, Palico provides a feature-flag-like system called App Config.

## What is App Config
App config is a key-value object that can you pass into your LLM application for each request. Using this key-value object, you can control the behavior of your LLM application. Here's an example of an app config that let's us easily swap different OpenAI models:

```typescript title="src/agents/my_agent/index.ts"
interface AppConfigParams {
  openaiModel?: string;
}

export default class MyAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    // highlight-start
    // 1. Add the appConfig parameter to the context
    context: ConversationContext<AppConfigParams>
    // highlight-end
  ): Promise<AgentResponse> {
    const { userMessage } = content;
    if (!userMessage) throw new Error("User message is required");
    const { 
      // highlight-start
      // 2. Retrieve the appConfig from the context
      appConfig: { 
        openaiModel = "gpt-3.5-turbo-0125" 
      },
      // highlight-end
     } = context;
    const openaiResponse = await this.openai.chat.completions.create({
      // highlight-start
      // 3. Use app config to control the behavior of the agent
      model: openaiModel,
      // highlight-end
      messages: [{ role: "user", content: userMessage }],
    });
    const responseMessage = openaiResponse.choices[0].message.content;
    if (!responseMessage) {
      throw new Error("Invalid response from OpenAI");
    }
    return {
      message: responseMessage,
    };
  }
}
```

## Calling an Agent with App Config
From your external services, such as a frontend application, you can call your agent with the app config. Here's an example of how you can call an agent with app config:

```typescript
await client.agents.newConversation({
  name: "my_agent",
  userMessage: "What's 2+2?",
  appConfig: {
    openaiModel: "gpt-4o-mini",
  },
});
```
Learn more about calling your agent from external services using our [client SDKs](./10_client_sdk.md).

## Next Steps
- [Test different LLM models with AI Gateway and AppConfig](./04_ai_gateway.md)
- [Iterate on your prompt with Prompt Management and AppConfig](./05_prompt_manage.md)
- [Compare different variations of your Application with Experiments](./07_experiments.md)