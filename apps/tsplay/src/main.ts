// import { createAPIClient } from '@palico-ai/client-js';

// const testStreamChat = async () => {
//   const agentAPIURL = process.env['PALICO_AGENT_API_URL'];
//   const serviceKey = process.env['PALICO_SERVICE_KEY'];
//   if (!agentAPIURL || !serviceKey) {
//     throw new Error('Missing Palico environment variables');
//   }
//   const { fetchStream } = createAPIClient({ rootURL: agentAPIURL, serviceKey });
//   const stream = fetchStream('/agent/streamer/conversation', {
//     method: 'POST',
//     body: {
//       content: {
//         userMessage: 'Hi, my name is Asif. Remember this',
//         payload: {},
//       },
//     },
//   });
//   for await (const chunk of stream) {
//     console.log(chunk);
//   }
// };

// testStreamChat();
