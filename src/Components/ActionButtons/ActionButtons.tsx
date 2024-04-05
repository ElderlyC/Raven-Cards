import { useState, useEffect } from "react";
import { Card, Deck } from "../../App";
import { Button, Badge } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import SettingsIcon from "@mui/icons-material/Settings";
import { pageContent } from "./ActionsText";

const ActionButtons = ({
  onChangeView,
  initialDeck,
  reviewCards,
  smallScreen,
  displayLang,
}) => {
  const { browse, review, days, hours, minutes, seconds, later, settings } =
    pageContent[displayLang];
  const [hoursUntilNextReview, setNext] = useState([0, "hrs"]);
  const emptyDeck = reviewCards.length === 0;

  const reviewText =
    (hoursUntilNextReview[0] as number) > 0
      ? `${!smallScreen && displayLang === "English" ? later : ""}~${
          hoursUntilNextReview[0]
        } ${hoursUntilNextReview[1]} ${displayLang !== "English" ? later : ""}`
      : review;

  useEffect(() => {
    const now = new Date();
    if (initialDeck.length > 0 && reviewCards.length === 0) {
      const timeSortedDeck: Deck = initialDeck.slice();
      timeSortedDeck.sort(
        (a: Card, b: Card) =>
          new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
      );
      const nextTime = new Date(timeSortedDeck[0].nextReview);
      const timeDifferenceSecs = (nextTime.getTime() - now.getTime()) / 1000;
      const timeDifferenceMins = timeDifferenceSecs / 60;
      // put calculation outside of setState, use switch case to check 1 number: (time left in mins)
      setNext(
        timeDifferenceMins / 60 > 24
          ? [Math.ceil(timeDifferenceMins / 1440), days]
          : timeDifferenceMins > 90
          ? [Math.ceil(timeDifferenceMins / 60), hours]
          : timeDifferenceMins < 1.5
          ? [timeDifferenceSecs.toFixed(), seconds]
          : [timeDifferenceMins.toFixed(), minutes]
      );
    }
  }, [initialDeck, reviewCards.length, days, hours, minutes, seconds]);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div style={{ flex: 1 }}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{
            fontWeight: "bold",
            padding: 0,
            height: "42.25px",
            lineHeight: "1rem",
          }}
          onClick={() => onChangeView("view")}
        >
          {browse}
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Button
          size="large"
          disabled={emptyDeck}
          onClick={() => onChangeView("review")}
          variant="contained"
          fullWidth
          sx={{
            fontWeight: "bold",
          }}
        >
          <QuizIcon
            className="quiz"
            sx={{
              "@media (max-width: 740px)": {
                margin: !emptyDeck ? "0 0 0 -10px" : "0 10px 0 5px",
              },
            }}
          />
          <span style={{ paddingRight: "5px" }}>{reviewText}</span>
          {!emptyDeck && (
            <Badge
              badgeContent={reviewCards.length}
              color="success"
              className="badge"
              sx={{
                "& .MuiBadge-badge": {
                  fontWeight: "bold",
                },
              }}
            />
          )}
        </Button>
      </div>
      <div style={{ flex: 1 }}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{
            fontWeight: "bold",
          }}
          onClick={() => onChangeView("settings")}
        >
          <SettingsIcon sx={{ marginRight: "4px" }} />
          <span>{settings}</span>
          <div style={{ marginLeft: "20px" }}></div>
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
