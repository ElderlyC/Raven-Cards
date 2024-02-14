import React, { useState, useEffect, useRef } from "react";
import { Paper, Grid, Button, styled, Typography, Box } from "@mui/material";
import { WordPair } from "../../types";

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
    <Box>
      <Typography variant="h2">Word List</Typography>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          fontWeight: "bold",
          height: "42.25px",
          margin: "10px",
          alignItems: "center",
        }}
      >
        <span>Front</span>
        <span>Back</span>
        <span>Tools</span>
      </Typography>

      <Box
        sx={{
          border: "1px solid #5c5c5c",
          borderRadius: "4px",
          padding: "10px",
          height: "370px",
          ":hover": { borderColor: "white" },
        }}
      >
        <StyledScrollbar
          style={{
            maxHeight: "350px",
          }}
          ref={scrollbarRef}
        >
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
                    <Button onClick={() => handleDeletePair(pair.source)}>
                      DEL
                    </Button>
                    <Button onClick={() => handleAddFlashcard(pair)}>
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
