# Client SDK

:::warning
This is currently under development
:::

We provide a client SDK to help you interact with your Palico App. You can install the SDK using npm:

```bash
npm i @palico-ai/client-js
```

## Usage

### Creating a new client

You should always create a Palico Client from server-side code. This is because the client SDK uses your API Key to authenticate requests.

To get a new API Key, checkout the [CLI documentation](./09_cli.md#generate-api-keys). You can create a new client like this:

You can view the full API Reference for Client SDK [here](https://palico-ai.github.io/palico-main/modules/_palico_ai_client_js.html)

```typescript
import { createClient } from '@palico-ai/client-js';

const client = createClient({
  apiURL: agentAPIURL,
  serviceKey,
});
```

### Sending a message
```typescript
await client.agents.newConversation({
  name: "Chatbot",
  userMessage: "Hello, my name is Foo",
  payload: {
    // Optional payload
  },
  featureFlags: {
    // Optional feature flags
  },
});
```

### Replying to a conversation
```typescript
await client.agents.replyAsUser({
  name: "Chatbot",
  conversationId: "1234",
  userMessage: "What's my name?",
  payload: {
    // Optional payload
  },
  featureFlags: {
    // Optional feature flags
  },
});
```