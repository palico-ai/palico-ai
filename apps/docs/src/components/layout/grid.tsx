import { Grid } from '@mui/material'
import React from 'react'
import { MDXContent } from '@theme-original/MDXComponents'

export interface EquallySpacedGridProps {
  gap?: number
  sx?: number
  md?: number
  lg?: number
  xl?: number
  children: React.ReactNode[]
}

export const EquallySpacedGrid: React.FC<EquallySpacedGridProps> = ({ 
  gap = 2,
  sx = 12,
  md = 6,
  lg = 4,
  xl = 3,
  children
 }) => {
  return (
    <Grid container spacing={gap}>
      {children.map((child, index) => (
        <Grid item xs={sx} md={md} lg={lg} xl={xl} key={index}>
          <MDXContent>
          {child}
          </MDXContent>
        </Grid>
      ))}
    </Grid>
  )
}