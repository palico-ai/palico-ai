# Build your Application

## Building a simple LLM Application
You can build an LLM application by creating a new folder within the `src/agents` directory and creating an `index.ts` file within it. This file should export a class that implements the `Agent` interface.

```typescript title="src/agents/my_agent/index.ts"
import {
  Agent,
  AgentResponse,
  ConversationContext,
  ConversationRequestContent,
} from "@palico-ai/app";

class MyLLMApp implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    // highlight-start
    // Your LLM application logic
    // 1. Pre-processing
    // 2. Build your prompt
    // 3. Call your LLM model
    // 4. Post-processing
    return {
      // 5. Return a response to caller
    }
      // highlight-end
  }
}
```

Agents are an encapsulation of your LLM application. Agents are generally your prompt logic and a call to your LLM model. You have complete control over the implementation detail of your LLM application within the `chat` method and can use any external libraries or services to help you build your application.

Learn more about `Agent` from it's [API Definition](https://palico-ai.github.io/palico-ai/interfaces/_palico_ai_app.Agent.html).

## The `chat()` method
The `Agent` interface only has the `chat()` method. This method is called when a user sends a message to your agent. The method takes in two parameters:
- `content`: Contains the user message and any other data passed by the caller
- `context`: Contains various context information such as the conversation ID, feature flags, trace ID, and more

#### Content
Content is defined as follows:
```typescript
export interface ConversationRequestContent<Payload> {
  userMessage?: string; // Any text-based message sent by the caller
  payload?: Payload; // Any additional data sent by the caller
}
```

#### Context
Context has various properties, such as:
```typescript
export interface ConversationContext {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  appConfig: Record<string, any>;
}
```
- `conversationId`: A unique identifier for the conversation. A conversation can span multiple messages. Each message in a conversation will have the same `conversationId`.
- `requestId`: A unique identifier for the request. Each message will have a unique `requestId`.
- `isNewConversation`: A boolean indicating if this is the first message in the conversation.
- `appConfig`: A dictionary of "feature flags" that can be used to control the behavior of your agent. This is where you define various independent variables for your experiments.

## Building a Conversational Application
For conversational applications, like chatbots, you need ways to keep track of conversation states such that you can maintain context across multiple message requests. To help you group multiple messages together, the chat method contains the `conversationId` property which acts as a unique identifier for requests that belong to the same conversation. Palico also provides a `ChatHistoryStore` class that you can use to store and retrieve conversation states. These conversation states are stored in a SQL database.

### Example Application
```typescript title="src/agents/chatbot_agent/index.ts"
import {
  ConversationContext,
  ConversationRequestContent,
  Agent,
  AgentResponse,
  ChatHistoryStore,
} from "@palico-ai/app";
import { ChatCompletionMessageParam } from "openai/resources";
import OpenAI from "openai";

export default class ChatbotAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    const { userMessage } = content;
    if (!userMessage) throw new Error("User message is required");
    const { conversationId, isNewConversation } = context;
    // highlight-next-line
    // 1. Create a new ChatHistoryStore object
    const historyStore = await ChatHistoryStore
      .fromConversation<ChatCompletionMessageParam>({
          conversationId,
          isNewConversation,
      });
    // highlight-next-line
    // 2. Append the user message to the history store
    historyStore.append({
      role: "user",
      content: userMessage,
    });
    // highlight-next-line
    // 3. Call the OpenAI API
    const openaiResponse = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: historyStore.messages,
    });
    const responseMessage = openaiResponse.choices[0].message.content;
    if (!responseMessage) {
      throw new Error("Invalid response from OpenAI");
    }
    // highlight-next-line
    // 4. Append the response message to the history store
    historyStore.append({
      role: "assistant",
      content: responseMessage,
    });
    // highlight-next-line
    // 5. Save the history store
    await historyStore.save();
    return {
      message: responseMessage,
    };
  }

  get openai() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
}
```
Learn more from the `ChatHistoryStore` class [API Definition](https://palico-ai.github.io/palico-ai/classes/_palico_ai_app.ChatHistoryStore.html).

## Next Steps
- [Preview Your Application in Palico Studio](./02_preview_changes.md)
- [Connect to your Agent from External Services with ClientSDK](./10_client_sdk.md)