/* eslint-disable @typescript-eslint/no-empty-function */
'use client'

import { ThemeProvider as MUIhemeProvider, createTheme } from '@mui/material/styles';
import { createContext, useMemo, useState } from "react"

interface ThemeProps {
  isDark: boolean,
  setIsDark: (value: boolean) => void
}

const ThemeContext = createContext<ThemeProps>({
  isDark: false,
  setIsDark: () => {}
})

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
        },
      }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={{isDark, setIsDark}}>
      <MUIhemeProvider theme={theme}>
        {children}
      </MUIhemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContext