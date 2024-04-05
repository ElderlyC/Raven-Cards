import React, { useState, useEffect, useRef } from "react";
import { Paper, Grid, Button, Typography, Box } from "@mui/material";
import { WordPair } from "../../types";
import classes from "./Wordlist.module.css";
import { pageContent } from "./WordlistText";

type WordListProps = {
  wordlist: WordPair[];
  onRemovePair: (source: string) => void;
  onAddCard: (pair: WordPair) => void;
  displayLang: string;
};

const Wordlist: React.FC<WordListProps> = ({
  wordlist,
  onRemovePair,
  onAddCard,
  displayLang,
}) => {
  const { title, front, back, tools, del, add } = pageContent[displayLang];
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  const handleDeletePair = (source: string) => {
    setScrollPosition(scrollbarRef?.current?.scrollTop || 0);
    onRemovePair(source);
  };

  const handleAddFlashcard = (pair: WordPair) => {
    onAddCard(pair);
  };

  useEffect(() => {
    scrollbarRef?.current?.scrollTo(0, scrollPosition);
  }, [wordlist, scrollPosition]);

  return (
    <Box className={classes.container}>
      <Typography variant="h2">{title}</Typography>
      <Typography
        variant="h5"
        className={classes.titles}
        sx={{
          margin: "10px",
        }}
      >
        <span>{front}</span>
        <span>{back}</span>
        <span>{tools}</span>
      </Typography>

      <Box className={classes.wordlist}>
        <div className={classes.scroll} ref={scrollbarRef}>
          <div className={classes.scroll2}>
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
                      {del}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleAddFlashcard(pair)}
                    >
                      {add}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Wordlist;
