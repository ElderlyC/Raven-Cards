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
import AddFlashcard from "../AddFlashcard/AddFlashcard";
// format it to be pretty + fit on mobile

type ViewDeckProps = {
  deck: Deck;
  onLeaveBrowser: () => void;
  onRemovePair: (source: string) => void;
};

const ViewDeck: React.FC<ViewDeckProps> = ({
  onLeaveBrowser,
  onRemovePair,
  deck,
}) => {
  const [cardDeck, setDeck] = useState(deck || []);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [editCard, setEditCard] = useState({
    image: [1, 0, ""] as [number, number, string],
    pair: { source: "", target: "" },
    meaning: "",
    examples: [{ text: "", translatedText: "" }],
    hanja: "",
  });

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

  const handleEditCard = (editCard: Card) => {
    setEditCard({
      image: [
        editCard.image ? editCard.image[0] : 1,
        editCard.image ? editCard.image[1] : 0,
        editCard.image ? editCard.image[2] : "",
      ],
      pair: { source: editCard.front, target: editCard.back },
      meaning: editCard.meaning,
      examples: [{ text: editCard.hint, translatedText: "" }],
      hanja: "",
    });
    setEditing(true);
  };

  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(cardDeck));
  }, [cardDeck]);

  return (
    <div>
      {editing ? (
        <div>
          <AddFlashcard
            image={editCard.image}
            editMode={true}
            pair={editCard.pair}
            meaning={editCard.meaning}
            examples={editCard.examples}
            hanja={editCard.hanja}
            onCardSubmit={() => setEditing(false)}
            deck={cardDeck}
            onRemovePair={onRemovePair}
          />
          <Button onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      ) : (
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
                            {card.image[2] && (
                              <img
                                alt="hint"
                                onClick={() => toggleModal(card.image[2])} //expand image to be visible
                                src={card.image[2]}
                                style={{
                                  width: "80px",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{readableDate(card.nextReview)}</TableCell>
                      <TableCell>{card.level}</TableCell>
                      <TableCell>{readableDate(card.created)}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditCard(card)}>
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete this card? [${card.front}]`
                              )
                            ) {
                              handleDeleteCard(card);
                            }
                          }}
                        >
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
      )}
    </div>
  );
};

export default ViewDeck;
