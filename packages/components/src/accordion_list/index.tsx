import {
  Accordion as MUIAccordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '../typography';

export interface AccordingListItemProps {
  summary?: string;
  summaryJSX?: React.ReactNode;
  detailText?: string;
  details?: React.ReactNode;
}

export const Accordion: React.FC<AccordingListItemProps> = ({
  summary,
  summaryJSX,
  detailText,
  details,
}) => {
  return (
    <MUIAccordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {summary}
        {summaryJSX}
      </AccordionSummary>
      <AccordionDetails>
        {detailText && <Typography variant="body2">{detailText}</Typography>}
        {details}
      </AccordionDetails>
    </MUIAccordion>
  );
};

export interface AccordionListProps {
  items: AccordingListItemProps[];
}

export const AccordionList: React.FC<AccordionListProps> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <Accordion key={index} {...item} />
      ))}
    </>
  );
};
