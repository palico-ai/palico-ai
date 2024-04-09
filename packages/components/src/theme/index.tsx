'use client'
import React from 'react'
import { ThemeProvider as MUIThemeProvider } from '@emotion/react'
import { ComponentWithChildren } from '..'
import { theme } from './theme'

export const ThemeProvider: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <MUIThemeProvider theme={theme}>
      {children}
    </MUIThemeProvider>
  )
}
