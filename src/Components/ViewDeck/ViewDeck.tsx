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
  Modal,
} from "@mui/material";
import { Deck, Card } from "../../App";
import classes from "./ViewDeck.module.css";
// make cards editable
// format it to be pretty + fit on mobile

type ViewDeckProps = {
  deck: Deck;
  onLeaveBrowser: () => void;
};

const ViewDeck: React.FC<ViewDeckProps> = ({ onLeaveBrowser, deck }) => {
  const [cardDeck, setDeck] = useState(deck || []);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const toggleModal = (url: string) => {
    setImageUrl(url);
    setShowModal(true);
  };

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
    <div>
      <div className={classes.backdrop}>
        <Modal open={showModal}>
          <div
            className={classes.modalOverlay}
            onClick={() => setShowModal(false)}
          >
            <div className={classes.modalContent}>
              <img src={imageUrl} alt="Modal" />
            </div>
          </div>
        </Modal>

        <Typography variant={"h2"}>Browse Deck</Typography>
        {cardDeck.length > 0 ? (
          <TableContainer component={Paper} className={classes.container}>
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
                            onClick={() => toggleModal(card.image[2])} //expand image to be visible
                            src={card.image[2]}
                            style={{
                              width: "80px",
                              objectFit: "cover",
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

        <Button variant="contained" onClick={() => onLeaveBrowser()}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ViewDeck;
