import { Box } from '@mui/material';
import { AccordionList, Typography } from '@palico-ai/components';

const useCases = [
  {
    summary: 'Build a Chatbot',
    detailText:
      'Build a chatbot that can answer questions about your product or service.',
  },
  {
    summary: 'Build a Copilot',
    detailText:
      'Build a recommendation engine that can suggest products to users based on their preferences.',
  },
  {
    summary: 'Build a Text Editor Copilot',
    detailText:
      'Build a sentiment analysis tool that can analyze the sentiment of text data.',
  },
  {
    summary: 'Q&A Over Document',
    detailText:
      'Build a fraud detection system that can detect fraudulent transactions.',
  },
  {
    summary: 'Summarize, Extract, Generate, Translate, and More',
    detailText:
      'Build a system that can summarize, extract, generate, and translate text data.',
  },
  {
    summary:
      'Data Extraction, Intent Classification, Sentiment Analysis, and More',
    detailText:
      'Build a system that can extract data, classify intent, analyze sentiment, and more.',
  },
];

const UseCases: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Build any LLM Applications
      </Typography>
      <Typography variant="subtitle2" mb={2}>
        You can basically build any LLM application. Here are some examples:
      </Typography>
      <Box>
        <AccordionList items={useCases} />
      </Box>
    </Box>
  );
};

export default UseCases;
