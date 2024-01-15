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
  const [cardDeleted, setCardDeleted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollTop, setScrollTop] = useState(
    localStorage.getItem("scroll") || 0
  );
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleDeletePair = (source: string) => {
    setCardDeleted(true);
    setScrollPosition(scrollbarRef?.current?.scrollTop || 0);
    onRemovePair(source);
  };

  const handleAddFlashcard = (pair: WordPair) => {
    //setCardDeleted(false);
    setCardDeleted(true);
    setScrollPosition(scrollbarRef?.current?.scrollTop || 0);
    console.log("first");
    //send current position to App, used as default on render
    onAddCard(pair);
    console.log(pair);
  };

  // const resetScrollPosition = () => {
  //   console.log("reset to:", scrollPosition);
  // scrollbarRef?.current?.scrollTo(0, scrollPosition);
  // };

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
    if (cardDeleted) {
      //card delete, add flashcard: maintain current scroll position
      //bug on add card, goes to TOP [rerender sets default 0 pos]
      // default should be set to
      scrollbarRef?.current?.scrollTo(0, scrollPosition);
      console.log("go current");
    } else {
      //first load, adding: go to bottom
      scrollbarRef.current?.scrollTo(0, scrollbarRef.current?.scrollHeight);
      console.log("go bottom");
    }
  }, [wordlist, scrollPosition, cardDeleted]);

  // const handleSetScroll = () => {
  //   setScrollTop(scrollbarRef?.current?.scrollTop || 0);
  // };
  // const [scrollNum, setScrollNum] = useState(0);

  // useEffect(() => {
  const handleScroll = () => {
    localStorage.setItem(
      "scroll",
      JSON.stringify(scrollbarRef?.current?.scrollTop)
    );
  };

  useEffect(() => {
    scrollbarRef?.current?.scrollTo(
      0,
      parseInt(localStorage.getItem("scroll") || "")
    );
    setCardDeleted(false);
  }, [scrollbarRef]);

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
        {/* <input id="num" value={scrollNum} onChange={() => ""} /> */}
        <StyledScrollbar
          ref={scrollbarRef}
          onScroll={handleScroll}
          style={{
            fontSize: "1.2rem",
            maxHeight: "400px",
          }}
        >
          <div ref={listRef}>
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
      <div>{scrollTop}</div>
    </Box>
  );
};

export default Wordlist;
