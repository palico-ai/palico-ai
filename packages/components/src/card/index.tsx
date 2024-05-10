import React from 'react'
import {
  Card as MUICard,
  CardProps as MUICardProps,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
} from '@mui/material'

export type CardProps = MUICardProps

const Card: React.FC<CardProps> = (props) => {
  return <MUICard {...props} />
}

export {
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Card
}
