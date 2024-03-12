import React, { useState, useEffect, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";
import { Deck, Card } from "../../App";
import classes from "./ReviewCards.module.css";

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
  const [wrong, setWrong] = useState(0);

  const currentIndex = reviewDeck.indexOf(card);

  const handleSkipCard = (method: string) => {
    if (currentIndex === reviewDeck.length - 1) {
      if (method === "button") onEndReview();
      else
        setTimeout(() => {
          onEndReview();
        }, 100);
    } else {
      setCard(reviewDeck[currentIndex + 1]);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAnswer("");
    const updatedDeck = [...reviewDeck];
    const currentCard = updatedDeck[currentIndex];
    let newLevel = card.level + 1;
    let newReviewDate = new Date();
    if (
      answer.toLowerCase().replaceAll(" ", "") !== // ignore capitals and spaces
      card.back.toLowerCase().replaceAll(" ", "")
    ) {
      setError(true);
      setWrong((p) => p + 1);
      if (currentCard.level === 0) return;
      newLevel = card.level - 1;
    } else {
      setScore((p) => p + 1);
      setError(false);
      const newInterval =
        newLevel < 3 ? 2 * Math.pow(2, newLevel) : Math.pow(2, newLevel - 3);
      // set new date/times
      newLevel < 3
        ? newReviewDate.setHours(newReviewDate.getHours() + newInterval)
        : newReviewDate.setDate(newReviewDate.getDate() + newInterval);
    }

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

    if (newLevel === card.level + 1 || wrong === 2) handleSkipCard("auto");
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
    setWrong(0);
    setAnswer("");
    setError(false);
  }, [card]);

  return (
    <div className={classes.container}>
      <Box key={card.created}>
        <Typography variant={"h3"}>{card.front}</Typography>
        <TextField
          multiline
          margin="normal"
          inputProps={{
            style: {
              textAlign: "center",
              fontSize: "2rem",
              width: "300px",
              lineHeight: "3rem",
            },
          }}
          onKeyDown={handleKeyDown}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          autoFocus
          error={error}
        />
      </Box>
      <Button variant="outlined" onClick={handleSubmit}>
        Enter
      </Button>
      <Box>
        <Button variant="outlined" onClick={() => setHint((p) => !p)}>
          {hint ? "Hints Off" : "Hints On"}
        </Button>

        <Button variant="outlined" onClick={() => handleSkipCard("button")}>
          Skip Card
        </Button>
      </Box>

      {hint && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" maxWidth={600} width={"80vw"} margin="10px">
            {card.hint}
          </Typography>
          {card?.image && card?.image[2] && (
            <Box className={classes.imageContainer}>
              <img
                src={card.image[2]}
                alt={card.image[2]}
                style={{
                  height: "169px",
                  objectFit: "cover",
                  scale: card.image[0].toString(),
                  marginTop: `${card.image[1]}%`,
                }}
              />
            </Box>
          )}
        </div>
      )}

      <Typography color="lime" margin={2}>
        Correct: {score}
      </Typography>
      {wrong > 0 && (
        <Typography color="error" margin={2}>
          Incorrect: {wrong}
        </Typography>
      )}
      <Button variant="contained" onClick={onEndReview}>
        Quit Review
      </Button>
    </div>
  );
};

export default ReviewCards;
