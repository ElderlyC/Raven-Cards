import React, { useState, useEffect, useRef } from "react";
import { Paper, Grid, Button, styled, Typography, Box } from "@mui/material";
import { WordPair } from "../../types";
import classes from "./Wordlist.module.css";

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
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  const handleDeletePair = (source: string) => {
    setScrollPosition(scrollbarRef?.current?.scrollTop || 0);
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

  useEffect(() => {
    scrollbarRef?.current?.scrollTo(0, scrollPosition);
  }, [wordlist, scrollPosition]);

  return (
    <Box className={classes.container}>
      <Typography variant="h2">Word List</Typography>
      <Typography
        variant="h5"
        className={classes.titles}
        sx={{
          margin: "10px",
        }}
      >
        <span>Front</span>
        <span>Back</span>
        <span>Tools</span>
      </Typography>

      <Box className={classes.wordlist}>
        <StyledScrollbar className={classes.scroll} ref={scrollbarRef}>
          <div>
            {wordlist.map((pair) => (
              <Paper
                key={pair.source + Math.random() * 10000}
                sx={{
                  marginBottom: "5px",
                  padding: "3px",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography fontSize="1.5rem">{pair.source}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography fontSize="1.2rem">{pair.target}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeletePair(pair.source)}
                    >
                      DEL
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleAddFlashcard(pair)}
                    >
                      ADD
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
