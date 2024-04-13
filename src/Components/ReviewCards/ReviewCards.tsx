import React, { useState, useEffect, KeyboardEventHandler } from "react";
import { Button, Typography, TextField, Box, Tooltip } from "@mui/material";
import { FaTimes, FaCheck } from "react-icons/fa";
import { Deck, Card } from "../../App";
import classes from "./ReviewCards.module.css";
import { pageContent } from "./ReviewText";

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
  const [reviewDeck, setDeck] = useState(
    reviewCards.slice().sort(() => Math.random() - 0.5)
  );
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreBump, setScoreBump] = useState(false);
  const [card, setCard] = useState<Card>(reviewDeck[0]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [bump, setBump] = useState(false);
  const options = localStorage.getItem("options");
  const oddFlipOn = options
    ? JSON.parse(options).oddLevelFlip && card.level % 2 === 1
    : false; // front and back are swapped on odd levels
  const displayLang = options ? JSON.parse(options).language : "English";
  const {
    enter,
    hintsOn,
    hintsOff,
    skip,
    quit,
    correct,
    incorrect,
    twotries,
    onetry,
  } = pageContent[displayLang];

  const currentIndex = reviewDeck.indexOf(card);

  const handleNextCard = (method: string) => {
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
    if (event.key === "Tab") {
      event.preventDefault();
      setHint((p) => !p);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) {
        handleNextCard("button");
        return;
      }
      if (answer === "") return;
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
    const cardAnswer = oddFlipOn
      ? card.front.toLowerCase().replaceAll(" ", "")
      : card.back.toLowerCase().replaceAll(" ", "");
    if (
      answer.toLowerCase().replaceAll(" ", "") !== // ignore capitals and spaces
      cardAnswer
    ) {
      setError(true);
      setWrong((p) => p + 1);
      setBump(true);
      newLevel = card.level - 1;
      if (currentCard.level === 0 || wrong < 2) newLevel = card.level;
    } else {
      setScore((p) => p + 1);
      setScoreBump(true);
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

    if (newLevel === card.level + 1 || wrong === 2) handleNextCard("auto");
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

  useEffect(() => {
    setTimeout(() => {
      setBump(false);
      setScoreBump(false);
    }, 500);
  }, [wrong, score]);

  return (
    <div className={classes.container}>
      {(bump || scoreBump) && (
        <Box
          className={`${classes.bigX} ${
            bump || scoreBump ? classes.fadeOut : ""
          }`}
        >
          {bump && <FaTimes style={{ color: "red", fontSize: "14rem" }} />}
          {scoreBump && (
            <FaCheck style={{ color: "green", fontSize: "14rem" }} />
          )}
        </Box>
      )}
      <Box key={card.created}>
        <Typography
          variant={"h3"}
          sx={{ fontSize: card.front.length > 15 ? "2rem" : "3rem" }}
        >
          {oddFlipOn ? card.back : card.front}
        </Typography>
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
        {enter}
      </Button>
      <Box>
        <Tooltip title="Tab">
          <Button variant="outlined" onClick={() => setHint((p) => !p)}>
            {hint ? hintsOff : hintsOn}
          </Button>
        </Tooltip>
        <Tooltip title="Shift+Enter">
          <Button variant="outlined" onClick={() => handleNextCard("button")}>
            {skip}
          </Button>
        </Tooltip>
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

      <Typography
        color="lime"
        margin={2}
        className={scoreBump ? classes.bumpAnimation : ""}
      >
        {correct} {score}
      </Typography>
      {wrong > 0 && (
        <Typography color="error" margin={2}>
          {incorrect} {wrong === 1 ? twotries : onetry}
        </Typography>
      )}
      <Button variant="contained" onClick={onEndReview}>
        {quit}
      </Button>
    </div>
  );
};

export default ReviewCards;
