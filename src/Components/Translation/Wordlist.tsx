import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Paper,
  Grid,
  Button,
  Input,
  styled,
  Typography,
  Box,
} from "@mui/material";
import { WordPair } from "../../types";
// list is saved in localStorage, added cards in a separate localStorage var.
// structure: added cards: [ {card1data}, {card2data} ]

// scrolling: fixed except for after meaning/def are updated

type WordListProps = {
  wordlist: WordPair[];
  onRemovePair: (source: string) => void;
  onAddCard: (pair: WordPair) => void;
};

const Wordlist: React.FC<WordListProps> = ({
  wordlist,
  onRemovePair,
  onAddCard,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const handleDeletePair = (source: string) => {
    onRemovePair(source);
  };

  const handleAddFlashcard = (pair: WordPair) => {
    onAddCard(pair);
  };

  const StyledScrollbar = styled("div")({
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#4c4c4c",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#1c1c1c",
    },
  });

  // useEffect(() => {
  //   console.log("listRef changed");
  // }, [listRef]);

  return (
    <Box
      sx={{
        margin: "15px",
      }}
    >
      <Typography variant="h2">Word List</Typography>
      <Box
        sx={{
          border: "4px solid #5c5c5c",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        <StyledScrollbar
          style={{
            fontSize: "1.2rem",
            maxHeight: "400px",
          }}
          // onAnimationEnd={() => console.log("changed")}
          // onTransitionEnd={() => console.log("changed")}
          onWheel={() => console.log("save the scroll pos")}
        >
          <div>
            {wordlist.map((pair) => (
              <Paper
                key={pair.source + Math.random() * 10000}
                sx={{ marginBottom: "5px", padding: "5px" }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <span>{pair.source}</span>
                  </Grid>
                  <Grid item xs={4}>
                    <Input defaultValue={pair.target} />
                  </Grid>
                  <Grid item xs={1}>
                    <Button onClick={() => handleDeletePair(pair.source)}>
                      Delete
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button onClick={() => handleAddFlashcard(pair)}>
                      Add Flashcard!
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </div>
        </StyledScrollbar>
      </Box>
    </Box>
  );
};

export default Wordlist;