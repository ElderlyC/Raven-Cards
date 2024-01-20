import React, { useState, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";

type ReviewCardsProps = {
  onEndReview: () => void;
};
// show front, input the back, correct adds 1 to score, level on card
// incorrect gives some indication?
// later: SRS timings
const ReviewCards: React.FC<ReviewCardsProps> = ({ onEndReview }) => {
  const localDeck = localStorage.getItem("deck");
  const initialDeck = localDeck ? JSON.parse(localDeck) : [];
  // sorting logic here (select all cards up for review)
  const [reviewDeck, setDeck] = useState(initialDeck);
  const [hint, setHint] = useState(false);
  const [card, setCard] = useState(reviewDeck[0]);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const widthback = 28 + card.back.length * 15;

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
      {reviewDeck.length === 0 ? (
        <div>
          <Typography>No cards to review, go back</Typography>
          <Button onClick={() => onEndReview()}>Go Back</Button>
        </div>
      ) : (
        <div>
          <Box>Score:{score}</Box>
          <Box key={card.created}>
            <Typography variant={"h3"}>{card.front}</Typography>
            <TextField
              InputProps={{
                style: {
                  fontSize: "2rem",
                  minWidth: "160px",
                  width: widthback,
                },
              }}
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
      )}
    </div>
  );
};

export default ReviewCards;
