import { Box, LinearProgress, TextField } from "@mui/material";
import React, { useEffect } from "react";
import FloatingContainer from "../utils/floating_container";

interface PromptFreetextProps {
  cursorY?: number;
  onSubmit: (text: string) => Promise<void>;
}

const PromptFreetext: React.FC<PromptFreetextProps> = ({
  onSubmit,
  cursorY,
}) => {
  const [text, setText] = React.useState<string>("");
  const [ref, setRef] = React.useState<HTMLInputElement | null>(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") {
      return;
    }
    try{
      setLoading(true);
      await onSubmit(text);
      setLoading(false);
    }catch(e){
      // TODO: Show error message
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <FloatingContainer x={0} y={cursorY} width={"100%"}>
      <Box component="form" onSubmit={handleSubmit} px={1} pb={1}>
        <TextField
          autoComplete="off"
          disabled={loading}
          variant="standard"
          inputRef={(el) => setRef(el)}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {loading && (
          <Box mt={1}>
            <LinearProgress />
          </Box>
        )}
      </Box>
    </FloatingContainer>
  );
};

export default PromptFreetext;
