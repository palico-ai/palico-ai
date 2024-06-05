import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '../typography';

export interface AccordingListItemProps {
  summary: string;
  detailText?: string;
  details?: React.ReactNode;
}

const AccordionItem: React.FC<AccordingListItemProps> = ({
  summary,
  detailText,
  details,
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">{summary}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {detailText && <Typography variant="body2">{detailText}</Typography>}
        {details}
      </AccordionDetails>
    </Accordion>
  );
};

export interface AccordionListProps {
  items: AccordingListItemProps[];
}

export const AccordionList: React.FC<AccordionListProps> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </>
  );
};
