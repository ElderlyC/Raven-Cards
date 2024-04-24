import React from "react";
import { Button, TextField } from "@mui/material";

// lingq-like paragraph view
// highlighted words
// clickable, separated words

const PassageViewer = ({ onExit, passage }) => {
  return (
    <div>
      PassageViewer<Button onClick={onExit}>Exit</Button>
      <TextField value={passage} />
    </div>
  );
};

export default PassageViewer;
