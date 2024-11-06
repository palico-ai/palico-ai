import { Box, Divider } from '@mui/material';
import {
  AccordionList,
  Button,
  Link,
  Markdown,
  SyntaxHighlighter,
} from '@palico-ai/components';
import { AgentMessage, IntermediateStep } from '@palico-ai/react';
import IntermediateStepIcon from '@mui/icons-material/FiberManualRecord';
import { ChatListItemDataDisplay } from './shared';
import { RoutePath } from '../../../../../utils/route_path';

interface IntermediateStepContentProps {
  steps: IntermediateStep[];
}

const IntermediateStepContent: React.FC<IntermediateStepContentProps> = ({
  steps,
}) => {
  return (
    <Box>
      {steps.map((step, index) => (
        <AccordionList
          key={index}
          items={[
            {
              summaryJSX: (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IntermediateStepIcon
                    sx={{
                      fontSize: 10,
                      color: 'primary.main',
                      mr: 1,
                    }}
                  />
                  {step.name}
                </Box>
              ),
              details: (
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <SyntaxHighlighter language="json">
                    {JSON.stringify(step.data, null, 2)}
                  </SyntaxHighlighter>
                </Box>
              ),
            },
          ]}
        />
      ))}
    </Box>
  );
};

type AgentChatListItemProps = AgentMessage;

const AgentChatListItem: React.FC<AgentChatListItemProps> = ({
  message,
  intermediateSteps,
  data,
  requestId,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {message && <Markdown>{message}</Markdown>}
      {intermediateSteps && intermediateSteps.length > 0 && (
        <ChatListItemDataDisplay title="Intermediate Steps">
          <IntermediateStepContent steps={intermediateSteps} />
        </ChatListItemDataDisplay>
      )}
      {data && (
        <ChatListItemDataDisplay title="Data">
          <SyntaxHighlighter language="json">
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </ChatListItemDataDisplay>
      )}
      {requestId && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Link
            target="_blank"
            href={RoutePath.requestTraceItem({
              requestId,
            })}
          >
            <Button size="small" color="secondary" variant="text">
              View Traces
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default AgentChatListItem;
