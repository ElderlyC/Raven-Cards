import React, { useState, useEffect, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";
import { Deck, Card } from "../../App";

type ReviewCardsProps = {
  deck: Deck;
  reviewCards: Deck;
  onEndReview: () => void;
};

// show front, input the back, correct adds 1 to score, level on card
// incorrect gives some indication?
// later: SRS timings
const ReviewCards: React.FC<ReviewCardsProps> = ({
  deck,
  reviewCards,
  onEndReview,
}) => {
  // sorting logic here (select all cards up for review)
  const [reviewDeck, setDeck] = useState(reviewCards);
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [card, setCard] = useState(reviewDeck[0]);
  const [answer, setAnswer] = useState("");
  const widthback = 28 + card?.back.length * 15;

  console.log(reviewDeck);

  const currentIndex = reviewDeck.indexOf(card);

  const handleSkipCard = () => {
    if (currentIndex === reviewDeck.length - 1) onEndReview();
    setAnswer("");
    setCard(reviewDeck[currentIndex + 1]);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter") {
      setAnswer("");
      if (answer.toLowerCase() !== card.back.toLowerCase()) {
        // do smth when incorrect
        console.log(card.back);
        return;
      }
      const newLevel = card.level + 1;
      let newReviewDate = new Date();
      const newInterval =
        newLevel < 3 ? 2 * Math.pow(2, newLevel) : Math.pow(2, newLevel - 3);
      newLevel < 3
        ? newReviewDate.setHours(newReviewDate.getHours() + newInterval)
        : newReviewDate.setDate(newReviewDate.getDate() + newInterval);

      setScore((p) => p + 1);
      if (card.level === 10) {
        setDeck((prev: Card[]) => {
          const updatedDeck = [...prev];
          updatedDeck[currentIndex].nextReview = "Mastered!";
          return updatedDeck;
        });
      } else {
        setDeck((prev: Card[]) => {
          const updatedDeck = [...prev];
          updatedDeck[currentIndex].level = newLevel;
          console.log("in state", newReviewDate);
          updatedDeck[currentIndex].nextReview = newReviewDate.toString();
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
    // merge altered reviewDeck with original deck (all cards)
    // this code doesnt work yet!
    console.log(deck, reviewDeck);
    const mergedDeck = deck.map((card) => {
      const matchingCard = reviewDeck.find(
        (reviewCard) => card.front === reviewCard.front
      );
      console.log(matchingCard, "mathco");
      if (matchingCard) {
        return matchingCard;
      }
      return card;
    });
    // const mergedDeck = deck.map((card) =>
    //   reviewDeck.find((reviewCard) => card.front === reviewCard.front)
    // );
    console.log(mergedDeck, "merge");
    localStorage.setItem("deck", JSON.stringify(mergedDeck));
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
          <Button onClick={() => setHint((p) => !p)}>
            {hint ? "Hints Off" : "Hints On"}
          </Button>
          <Button onClick={handleSkipCard}>Skip Card</Button>
          {hint && <Typography>{card.example}</Typography>}
        </div>
      )}
      <Typography variant={"h4"}>Score: {score}</Typography>
    </div>
  );
};

export default ReviewCards;
