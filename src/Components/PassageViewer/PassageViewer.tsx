import React from "react";
import { Box, Button, Typography } from "@mui/material";
import classes from "./PassageViewer.module.css";

// lingq-like paragraph view
// highlighted words
// clickable, separated words

const PassageViewer = ({ onExit, passage }) => {
  const lines = passage.trim().split("\n");
  const wordArr = lines.map((line) => line.split(/\s+/));

  console.log(wordArr);
  return (
    <Box className={classes.container}>
      <Typography variant="h2">Passage</Typography>
      <Box className={classes.scroll}>
        {wordArr.map((line) => (
          <Box>
            {line.map((word) => (
              <Button
                style={{ fontSize: "1.5rem", textTransform: "none" }}
                variant="outlined"
              >
                {word}
              </Button>
            ))}
          </Box>
        ))}
        {/* <TextField
          value={passage}
          className={classes.textfield}
          fullWidth
          variant="outlined"
          color="primary"
          multiline
          rows={7}
        /> */}
      </Box>
      <Button onClick={onExit} variant="contained">
        Exit
      </Button>
    </Box>
  );
};

export default PassageViewer;
