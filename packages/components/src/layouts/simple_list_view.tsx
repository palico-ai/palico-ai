'use client';

import { Box, Card, Divider, Grid, List, Typography } from '@mui/material';
import React, { ReactNode, useMemo } from 'react';

interface SimpleListViewProps<Item> {
  renderItem: (item: Item) => React.ReactNode;
  dividerBetweenItems?: boolean;
  noItemsMessage?: string | React.ReactNode;
  gridView?: boolean; // default is list view
  card?: boolean; // default is list view
  renderHeader?: () => React.ReactNode;
  items: Item[];
}

const NoItemText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10vh',
      }}
    >
      <Typography
        variant="h5"
        textAlign={'center'}
        whiteSpace={'pre'}
        gutterBottom
      >
        {text}
      </Typography>
    </Box>
  );
};

export function SimpleListView<Item>(
  props: SimpleListViewProps<Item>
): ReactNode {
  const {
    card = false,
    items,
    gridView = false,
    dividerBetweenItems = false,
    renderItem,
    renderHeader,
  } = props;

  const itemView = useMemo(() => {
    const itemsJSX = items.map((item, index) => {
      return (
        <React.Fragment key={JSON.stringify(item)}>
          {renderItem(item)}
          {dividerBetweenItems && index !== items.length - 1 && (
            <Divider sx={{ my: 2 }} component={'li'} variant="inset" />
          )}
        </React.Fragment>
      );
    });

    if (gridView) {
      return (
        <Grid container spacing={2}>
          {itemsJSX}
        </Grid>
      );
    }
    return (
      <List
        sx={{
          width: '100%',
        }}
      >
        {itemsJSX}
      </List>
    );
  }, [dividerBetweenItems, gridView, items, renderItem]);

  const noItemMessage = useMemo(() => {
    if (!(items.length === 0)) {
      return;
    }
    if (typeof props.noItemsMessage === 'string') {
      return <NoItemText text={props.noItemsMessage} />;
    }
    return props.noItemsMessage;
  }, [items.length, props.noItemsMessage]);

  const header = useMemo(() => {
    if (!renderHeader) {
      return null;
    }
    return (
      <Box>
        {renderHeader()}
        <Divider sx={{ my: 2 }} />
      </Box>
    );
  }, [renderHeader]);

  const content = useMemo(() => {
    return (
      <>
        {header}
        {itemView}
        {noItemMessage}
      </>
    );
  }, [header, itemView, noItemMessage]);

  if (card) {
    return <Card>{content}</Card>;
  }
  return <Box>{content}</Box>;
}
