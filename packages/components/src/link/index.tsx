'use client';
import React from 'react';
import NextLink from 'next/link';
import { PropsOf } from '@emotion/react';

export interface LinkProps extends Omit<PropsOf<typeof NextLink>, 'href'> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, style, ...rest }) => {
  const isExternal = href.startsWith('http');
  if (isExternal) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        href={href}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          ...style,
        }}
        {...rest}
      />
    );
  }

  return (
    <NextLink
      href={href}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        ...style,
      }}
      {...rest}
    />
  );
};
