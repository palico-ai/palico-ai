import React from "react";
import { Box, Paper } from "@mui/material";

type FloatingContainerProps = {
  children: React.ReactNode;
  x?: number;
  y?: number;
  width?: string | number;
  maxHeight?: number | string;
  alwaysScrollToBottom?: boolean;
};

const FloatingContainer: React.FC<FloatingContainerProps> = ({
  children,
  x = 0,
  y = 0,
  width,
  maxHeight,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: y,
        left: x,
        width: width,
        maxHeight: maxHeight,
        ...(maxHeight ? { overflowY: "auto" } : {}),
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: 8 }} />
        <Paper sx={{ width: "100%", maxHeight: "100%" }}>{children}</Paper>
        <Box sx={{ width: 8 }} />
      </Box>
    </Box>
  );
};

export default FloatingContainer;
