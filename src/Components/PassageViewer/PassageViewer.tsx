import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import classes from "./PassageViewer.module.css";

// lingq-like paragraph view
// highlighted words
// clickable, separated words

const PassageViewer = ({ onExit, passage }) => {
  return (
    <Box className={classes.container}>
      <Typography>Passage</Typography>
      <Box className={classes.scroll}>
        <TextField
          value={passage}
          className={classes.textfield}
          fullWidth
          variant="outlined"
          color="primary"
          multiline
          rows={7}
        />
      </Box>
      <Button onClick={onExit}>Exit</Button>
    </Box>
  );
};

export default PassageViewer;
