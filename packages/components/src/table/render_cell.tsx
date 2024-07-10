import { useState } from 'react';

interface ExpandableTextCellProps {
  fullContent: string;
}

const ExpandableTextCell: React.FC<ExpandableTextCellProps> = ({
  fullContent,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <span>
      {expanded ? fullContent : fullContent.slice(0, 100)}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  );
};

export default ExpandableTextCell;
