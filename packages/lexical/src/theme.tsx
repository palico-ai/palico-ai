import React from 'react'
import { ThemeProvider as MUIThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'

interface ThemeProviderProps {
  children: React.ReactNode
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#7434DB',
    },
  
    secondary: {
      main: '#52555A',
    },
  
    info: {
      main: '#1A73E8',
    },
  
    success: {
      main: '#4CAF50',
    },
  
    warning: {
      main: '#fb8c00',
    },
  
    error: {
      main: '#F44335',
    },
  }
})

const ThemeProvider : React.FC<ThemeProviderProps> = ({ children }) => {
  return (
  <MUIThemeProvider theme={theme}>
    {children}
  </MUIThemeProvider>
  )
}

export default ThemeProvider