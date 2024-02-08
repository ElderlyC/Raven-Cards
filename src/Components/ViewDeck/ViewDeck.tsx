import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Deck, Card } from "../../App";
// [OP] ImageLink
// make cards editable
// format it to be pretty + fit on mobile

type ViewDeckProps = {
  deck: Deck;
  onLeaveBrowser: () => void;
};

const ViewDeck: React.FC<ViewDeckProps> = ({ onLeaveBrowser, deck }) => {
  const [cardDeck, setDeck] = useState(deck || []);

  const readableDate = (dateString: string) => {
    if (dateString === "Mastered!") return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      hour12: false,
      // year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
    });
  };

  const handleDeleteCard = (deleteCard: Card) => {
    setDeck((deck) => deck.filter((card) => card !== deleteCard));
  };

  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(cardDeck));
  }, [cardDeck]);

  return (
    <div style={{ width: "80%", maxWidth: "1000px" }}>
      <Typography variant={"h2"}>Browse Deck</Typography>
      {cardDeck.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: "600px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Front</TableCell>
                <TableCell>Back</TableCell>
                <TableCell>Hint</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Next Review</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Created</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cardDeck.map((card) => (
                <TableRow key={card.front}>
                  <TableCell>{card.front}</TableCell>
                  <TableCell>{card.back}</TableCell>
                  <TableCell>{card.hint}</TableCell>
                  <TableCell>
                    {card.image && (
                      <div
                        style={{
                          overflow: "hidden",
                          height: "40px",
                          display: "flex",
                        }}
                      >
                        <img
                          onClick={() => console.log("je")} //expand image to be visible
                          src={card.image[2]}
                          style={{
                            width: "80px",
                            objectFit: "cover",
                            // transform: `scale(${card.image[0] * (40 / 80)})`, // change the scale with zoom clicks until final click resets (array) [1,2,3,4]
                            // marginTop: `${card.image[1] * 7}%`,
                          }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{readableDate(card.nextReview)}</TableCell>
                  <TableCell>{card.level}</TableCell>
                  <TableCell>{readableDate(card.created)}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteCard(card)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant={"h4"} sx={{ margin: "30px" }}>
          No cards yet!
        </Typography>
      )}
      <Button onClick={() => onLeaveBrowser()}>Go Back</Button>
    </div>
  );
};

export default ViewDeck;
