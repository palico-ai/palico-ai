"use client";
import { Box, IconButton, useTheme } from "@mui/material";
import React from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ThemeContext from "../context/theme";
import { CopilotProvider } from "../copilot/context";
import CopilotButton from "../copilot/button";

export default function Home() {
  const theme = useTheme();
  const { isDark, setIsDark } = React.useContext(ThemeContext);

  const handleClickToggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <main>
      <CopilotProvider>
        <CopilotButton />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Box>
            {theme.palette.mode} mode
            <IconButton
              sx={{ ml: 1 }}
              onClick={handleClickToggleTheme}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>
        </Box>
      </CopilotProvider>
    </main>
  );
}
