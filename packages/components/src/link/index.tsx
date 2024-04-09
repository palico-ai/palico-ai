'use client'
import React from 'react'
import NextLink from 'next/link'
import { PropsOf } from '@emotion/react'

interface LinkProps extends Omit<PropsOf<typeof NextLink>, 'href'> {
  href: string
}

export const Link: React.FC<LinkProps> = ({ href, style, ...rest }) => {
  return <NextLink href={href} style={{
    textDecoration: 'none',
    color: 'inherit',
    ...style
  }} {...rest} />
}
