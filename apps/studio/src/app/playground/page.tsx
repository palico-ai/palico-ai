import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../context/conversation';

const PlaygroundPage: React.FC = () => {
  const agentAPIURL = 'http://localhost:8000';
  const serviceKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50SWQiOi0xLCJpYXQiOjE3MTI3MDg4NTB9.mnUJ8AXWKOS8e7VsXaOw9ntNpqmyRwuweb1VsEpJnfA';

  return (
    <ConversationContextProvider apiURL={agentAPIURL} serviceKey={serviceKey}>
      <ChatUI />
    </ConversationContextProvider>
  );
};

export default PlaygroundPage;
