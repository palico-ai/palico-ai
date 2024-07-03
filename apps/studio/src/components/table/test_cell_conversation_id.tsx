import { useEffect, useState } from 'react';
import { getConversationTelemetry } from '../../services/telemetry';
import { Link } from '@palico-ai/components';

interface EvalTraceLinkCellProps {
  conversationId: string;
}

const EvalTraceLinkCell = ({ conversationId }: EvalTraceLinkCellProps) => {
  const [traceUrl, setTraceURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleSetTraceURL = async () => {
      try {
        const trace = await getConversationTelemetry(conversationId);
        setTraceURL(trace.requests[0].tracePreviewUrl);
      } catch (error) {
        console.error(error);
      }
    };

    void handleSetTraceURL();
  }, [conversationId]);

  if (!traceUrl) {
    return <>{conversationId}</>;
  }
  return (
    <Link href={traceUrl} target="_blank">
      {conversationId}
    </Link>
  );
};

export default EvalTraceLinkCell;
