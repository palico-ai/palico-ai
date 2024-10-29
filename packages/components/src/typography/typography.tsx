import React, { useMemo } from 'react';
import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material';
import { diffWords } from 'diff';

export interface TypographyProps extends MuiTypographyProps {
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  ...rest
}) => {
  return <MuiTypography {...rest}>{children}</MuiTypography>;
};

export interface TextDiffProps {
  baseline: string;
  current: string;
  variant?: MuiTypographyProps['variant'];
}

export const TextDiff: React.FC<TextDiffProps> = ({
  baseline,
  current,
  variant,
}) => {
  const diff = useMemo(() => {
    return diffWords(baseline, current);
  }, [baseline, current]);

  return (
    <>
      {diff.map((part, index) => (
        <Typography
          key={index}
          display={'inline'}
          whiteSpace={'pre-line'}
          variant={variant}
          sx={(theme) => ({
            color: part.added
              ? theme.palette.success.main
              : part.removed
              ? theme.palette.error.main
              : 'initial',
          })}
        >
          {part.value}
        </Typography>
      ))}
    </>
  );
};
