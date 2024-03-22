import { ComponentWithChildren } from "@site/src/types";
import Heading from "@theme/Heading";
import { Box } from "@mui/material";
import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

export interface CardProps extends ComponentWithChildren {
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const { colorMode } = useColorMode();
  console.log("colorMode", colorMode);
  const bgColor = { light: "#fff", dark: "#2f2f2f" };
  
  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: bgColor[colorMode],
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export type SimpleCardProps = {
  title: string;
  fullHeight?: boolean;
  description?: string;
  link?: string;
  style?: React.CSSProperties;
};

export const SimpleCard: React.FC<SimpleCardProps> = ({
  title,
  description,
  link,
  fullHeight,
  style
}) => {
  const fullHeightStyle : React.CSSProperties = fullHeight ? { 
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
   } : {};

  const card = (
    <Card style={{
      ...fullHeightStyle,
      ...style,
    }}>
      <Heading as={"h4"}>{title}</Heading>
      {description && description}
    </Card>
  );
  if (link) {
    return (
      <a
        href={link}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {card}
      </a>
    );
  }
  return card;
};
