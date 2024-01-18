import React, { useState } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";

type ReviewCardsProps = {
  onEndReview: () => void;
};
// array of cards that are to be reviewed
// gets updated on App load
// going into review mode shows 1 card at a time,
// going through the entire array changes view back to home
// show front, input the back, correct adds 1 to score, level on card
// incorrect gives a second chance
// hint: meaning/examples
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
  const [reviewDeck, setDeck] = useState(initialDeck);
  const [hint, setHint] = useState(false);
  const [card, setCard] = useState<Card>(reviewDeck[0]);
  const [score, setScore] = useState(0);

  const handleNextCard = () => {
    const currentIndex = reviewDeck.indexOf(card);
    if (currentIndex === reviewDeck.length - 1) {
      setCard(reviewDeck[0]);
    } else {
      setCard(reviewDeck[currentIndex + 1]);
    }
    setScore((p) => p + 1);
  };

  return (
    <div>
      <Box>Score:{score}</Box>
      <Box key={card.created}>
        <Typography>{card.front}</Typography>
        <Typography>{card.back}</Typography>
      </Box>
      <Button onClick={() => setHint((p) => !p)}>Toggle Hint</Button>
      <Button onClick={handleNextCard}>Next Card</Button>
      <Button onClick={() => onEndReview()}>End Review</Button>
      {hint && (
        <Typography>
          {card.example}
          <br />
          {card.meaning}
        </Typography>
      )}
    </div>
  );
};

export default ReviewCards;
