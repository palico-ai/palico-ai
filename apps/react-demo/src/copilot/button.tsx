import { Button } from "@mui/material";
import { ChatWidget } from "@palico-ai/react";
import { useContext, useState } from "react";
import ThemeContext from "../context/theme";

const CopilotButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        ref={setAnchorEl}
        onClick={handleClick}
      >
        Copilot
      </Button>
      <ChatWidget
        getSendMessageParams={async (userinput: string) => {
          return {
            message: userinput,
            context: {
              isDarkMode: isDark,
            }
          };
        }}
        width="400px"
        height="600px"
        headerTitle="Chatbot"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
};

export default CopilotButton;