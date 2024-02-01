import React, { useState, useEffect, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";
import { Deck, Card } from "../../App";

// no cards to review case obsolete / delete code

type ReviewCardsProps = {
  deck: Deck;
  reviewCards: Deck;
  onEndReview: () => void;
};

const ReviewCards: React.FC<ReviewCardsProps> = ({
  deck,
  reviewCards,
  onEndReview,
}) => {
  const [reviewDeck, setDeck] = useState(reviewCards);
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [card, setCard] = useState<Card>(reviewDeck[0]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
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
      const updatedDeck = [...reviewDeck];
      const currentCard = updatedDeck[currentIndex];
      let newLevel = card.level + 1;
      if (answer.toLowerCase() !== card.back.toLowerCase()) {
        setError(true);
        if (currentCard.level === 0) return;
        newLevel = card.level - 1;
      } else {
        setScore((p) => p + 1);
        setError(false);
      }

      let newReviewDate = new Date();
      const newInterval =
        newLevel < 3 ? 2 * Math.pow(2, newLevel) : Math.pow(2, newLevel - 3);
      // set new date/times
      newLevel < 3
        ? newReviewDate.setHours(newReviewDate.getHours() + newInterval)
        : newReviewDate.setDate(newReviewDate.getDate() + newInterval);

      if (card.level === 10) {
        setDeck(() => {
          currentCard.nextReview = "Mastered!";
          return updatedDeck;
        });
      } else {
        setDeck(() => {
          currentCard.level = newLevel;
          currentCard.nextReview = newReviewDate.toString();
          return updatedDeck;
        });
      }

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
    const mergedDeck = deck.map((card) => {
      const matchingCard = reviewDeck.find(
        (reviewCard) => card.front === reviewCard.front
      );
      if (matchingCard) {
        return matchingCard;
      }
      return card;
    });
    localStorage.setItem("deck", JSON.stringify(mergedDeck));
  }, [deck, reviewDeck]);

  useEffect(() => {
    setError(false);
  }, [card]);

  return (
    <div>
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
          error={error}
        />
      </Box>

      <Button onClick={() => setHint((p) => !p)}>
        {hint ? "Hints Off" : "Hints On"}
      </Button>

      <Button onClick={handleSkipCard}>Skip Card</Button>
      {hint && <Typography>{card.example}</Typography>}

      <Typography variant={"h4"}>Score: {score}</Typography>
    </div>
  );
};

export default ReviewCards;
