# Chat History Store

For conversational applications like chatbots, you need to often store conversation states in a database. Palico provides a conversation store out-of-the-box for you to easily store and retrieve conversation states. You can view the API Reference [here](https://palico-ai.github.io/palico-main/classes/ChatHistoryStore.html)

## Getting a Conversation State

You can create or retrieve a conversation state using `fromConversation()` method. Here's an example of how you can use it:

```typescript
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const handleNewConversation = async () => {
  const historyDB =
    await ChatHistoryStore.fromConversation<ChatCompletionMessageParam>({
      conversationId,
      newConversation: true,
    });
};
```

Note the `newConversation` flag. This is an optional flag that you can set to `true` if you want to create a new conversation state. If it's left `undefined`, it'll retrieve the existing conversation state or create a new one if it doesn't exist.

## Adding messages to conversation

You can add message with the `append()` method. You just always manually save the conversation with the `save()` method. Here's an example of how you can use it:

```typescript
const handleNewConversation = async (message: string) => {
  // Adding new messages to conversation store
  historyDB
    .append({
      role: 'system',
      content: 'You are a helpful assistant',
    })
    .append({
      role: 'user',
      content: message,
    });
  // Calling OpenAI with the current conversation history
  const openAIResponse = await openaiClient.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: historyDB.messages,
  });
  historyDB.append({
    role: 'system',
    content: openAIResponse.choices[0].message.content,
  });
  // Saving the conversation state
  await historyDB.save();
};
```
