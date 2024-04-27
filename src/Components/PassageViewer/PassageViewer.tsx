import React from "react";
import { Box, Button, Typography } from "@mui/material";
import classes from "./PassageViewer.module.css";

// lingq-like (use pic)
// highlighted words
// clickable, separated words
// translate by word / by sentence
// words are separated not by spaces but non-letters

const PassageViewer = ({ onExit, passage }) => {
  // const lines = passage.trim().split("\n");
  // const wordArr = lines.map((line) =>
  //   line.split(/\s+/).filter((word) => word !== "")
  // );

  const wordArr = passage.split(/(\w+|[^\w\s])/).filter(Boolean);

  return (
    <Box className={classes.container}>
      <Typography variant="h2">Passage</Typography>
      <Box className={classes.scroll}>
        {wordArr.map((word) =>
          /^[a-zA-Z]+$/.test(word) ? (
            <Button
              style={{
                fontSize: "1.5rem",
                textTransform: "none",
                minWidth: "20px",
              }}
              variant="text"
            >
              {word}
            </Button>
          ) : (
            <span style={{ fontSize: "1.5rem" }}>{word}</span>
          )
        )}
        {/* {wordArr.map((line) => (
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
        ))} */}
      </Box>
      <Box>Word List</Box>
      <Button onClick={onExit} variant="contained">
        Exit
      </Button>
    </Box>
  );
};

export default PassageViewer;
