import { Cell } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { getTracesForConversation } from '../../services/telemetry';
import { Link } from '@palico-ai/components';

interface TestCellConversationIdProps {
  cell: Cell<any, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderContent: () => React.ReactNode;
}

const TestCellConversationID = ({
  cell,
  renderContent,
}: TestCellConversationIdProps) => {
  const [traceUrl, setTraceURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleSetTraceURL = async () => {
      try {
        const trace = await getTracesForConversation(
          cell.row.original.output.conversationId
        );
        setTraceURL(trace.requests[0].tracePreviewUrl);
      } catch (error) {
        console.error(error);
      }
    };

    void handleSetTraceURL();
  }, [cell.row.original.output.conversationId]);

  if (!traceUrl) {
    return renderContent();
  }
  return (
    <Link href={traceUrl} target="_blank">
      {renderContent()}
    </Link>
  );
};

export default TestCellConversationID;
