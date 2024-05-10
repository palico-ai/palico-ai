import React from 'react'
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material'

export interface TypographyProps extends MuiTypographyProps {
  children: React.ReactNode
}

export const Typography: React.FC<TypographyProps> = ({ children, ...rest }) => {
  return (
    <MuiTypography {...rest}>
      {children}
    </MuiTypography>
  )
}

export default Typography