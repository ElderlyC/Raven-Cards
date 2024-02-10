import React, { useState, useEffect, useRef } from "react";
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
      <Box
        sx={{
          border: "4px solid #5c5c5c",
          borderRadius: "15px",
          padding: "20px",
          margin: "10px",
        }}
      >
        <StyledScrollbar
          style={{
            maxHeight: "400px",
          }}
          ref={scrollbarRef}
        >
          <div>
            {wordlist.map((pair) => (
              <Paper
                key={pair.source + Math.random() * 10000}
                sx={{
                  marginBottom: "5px",
                  padding: "5px",
                  width: "35vw",
                  //maxWidth: "35vw",
                  //maxWidth: "100%",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3.5}>
                    <Typography fontSize="1.5rem">{pair.source}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography fontSize="1.2rem">{pair.target}</Typography>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Button onClick={() => handleDeletePair(pair.source)}>
                      DEL
                    </Button>
                  </Grid>
                  <Grid item xs={1.5}>
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
