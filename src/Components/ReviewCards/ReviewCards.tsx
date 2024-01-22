import React, { useState, useEffect, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";
import { Card } from "../../App";

type ReviewCardsProps = {
  onEndReview: () => void;
};

// show front, input the back, correct adds 1 to score, level on card
// incorrect gives some indication?
// later: SRS timings
// toLowerCase Culling/culling both correct
// Card type from App.tsx
const ReviewCards: React.FC<ReviewCardsProps> = ({ onEndReview }) => {
  const localDeck = localStorage.getItem("deck");
  const initialDeck = localDeck ? JSON.parse(localDeck) : [];
  // sorting logic here (select all cards up for review)
  const [reviewDeck, setDeck] = useState(initialDeck);
  const [hint, setHint] = useState(false);
  const [card, setCard] = useState(reviewDeck[0]);
  const [answer, setAnswer] = useState("");
  const widthback = 28 + card?.back.length * 15;

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
      const newLevel = card.level + 1;
      setDeck((prev: Card[]) => {
        const updatedDeck = [...prev];
        updatedDeck[currentIndex].level = newLevel;
        return updatedDeck;
      });

      if (currentIndex === reviewDeck.length - 1) {
        event.preventDefault();
        setTimeout(() => {
          onEndReview();
        }, 100);
      } else {
        setCard(reviewDeck[currentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(reviewDeck));
  }, [reviewDeck]);

  return (
    <div>
      {reviewDeck.length === 0 ? (
        <div>
          <Typography>No cards to review, go back</Typography>
          <Button onClick={() => onEndReview()}>Go Back</Button>
        </div>
      ) : (
        <div>
          <div>Card Level: {card.level}</div>
          <Box key={card.created}>
            <Typography variant={"h3"}>{card.front}</Typography>
            <TextField
              inputProps={{
                style: {
                  textAlign: "center",
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
