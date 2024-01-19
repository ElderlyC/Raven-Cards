import React, { useState, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";

type ReviewCardsProps = {
  onEndReview: () => void;
};
// show front, input the back, correct adds 1 to score, level on card
// incorrect gives some indication?
// later: SRS timings
const ReviewCards: React.FC<ReviewCardsProps> = ({ onEndReview }) => {
  type Card = {
    front: string;
    back: string;
    created: string;
    nextReview: string;
    level: number;
    example: string;
    meaning: string;
  };
  const localDeck = localStorage.getItem("deck");
  const initialDeck = localDeck ? JSON.parse(localDeck) : [];
  // sorting logic here (select all cards up for review)
  const [reviewDeck, setDeck] = useState(initialDeck);
  const [hint, setHint] = useState(false);
  const [card, setCard] = useState<Card>(reviewDeck[0]);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");

  const currentIndex = reviewDeck.indexOf(card);

  const handleSkipCard = () => {
    if (currentIndex === reviewDeck.length - 1) onEndReview();
    setAnswer("");
    setCard(reviewDeck[currentIndex + 1]);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter") {
      setAnswer("");
      if (answer !== card.back) {
        console.log(card.back);
        return;
      }
      if (currentIndex === reviewDeck.length - 1) {
        event.preventDefault();
        onEndReview();
      }
      setCard(reviewDeck[currentIndex + 1]);
      setScore((p) => p + 1);
    }
  };

  return (
    <div>
      <Box>Score:{score}</Box>
      <Box key={card.created}>
        <Typography>{card.front}</Typography>
        {/* <Typography>{card.back}</Typography> */}
        <TextField
          onKeyDown={handleKeyDown}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          autoFocus
        />
      </Box>
      <Button onClick={() => setHint((p) => !p)}>Toggle Hint</Button>
      <Button onClick={handleSkipCard}>Skip Card</Button>
      {hint && <Typography>{card.example}</Typography>}
    </div>
  );
};

export default ReviewCards;
