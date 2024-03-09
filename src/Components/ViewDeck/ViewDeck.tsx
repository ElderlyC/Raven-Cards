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
  Box,
  Link,
} from "@mui/material";
import { Deck, Card } from "../../App";
import classes from "./ViewDeck.module.css";
import AddFlashcard from "../AddFlashcard/AddFlashcard";
// browser search function

type ViewDeckProps = {
  deck: Deck;
  onLeaveBrowser: () => void;
  onImportExport: () => void;
  onRemovePair: (source: string) => void;
};

const ViewDeck: React.FC<ViewDeckProps> = ({
  onLeaveBrowser,
  onImportExport,
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
  const [displayDeck, setDisplay] = useState(cardDeck.slice().reverse()); // display newest cards first
  const [ascending, setAscending] = useState(true);

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
    setDisplay((prev) => prev.filter((card) => card !== deleteCard));
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

  const handleOrderBy = (column: string) => {
    const sortedDeck = [...displayDeck].sort((a, b) => {
      if (column === "front" || column === "back") {
        const aValue = a[column].toLowerCase();
        const bValue = b[column].toLowerCase();
        return aValue.localeCompare(bValue);
      } else
        return new Date(a[column]).getTime() - new Date(b[column]).getTime();
    });
    setAscending(!ascending);
    setDisplay(ascending ? sortedDeck : sortedDeck.reverse());
  };

  useEffect(() => {
    localStorage.setItem("deck", JSON.stringify(cardDeck));
  }, [cardDeck]);

  return (
    <div className={classes.bigContainer}>
      {editing ? (
        <AddFlashcard
          image={editCard.image}
          editMode={true}
          pair={editCard.pair}
          meaning={editCard.meaning}
          examples={editCard.examples}
          hanja={editCard.hanja}
          onEndEditing={() => setEditing(false)}
          deck={cardDeck}
          onRemovePair={onRemovePair}
        />
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
          <span>Total Cards: {cardDeck.length}</span>
          {cardDeck.length > 0 ? (
            <TableContainer component={Paper} className={classes.container}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("front")}
                        sx={{ cursor: "pointer" }}
                      >
                        Front
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("back")}
                        sx={{ cursor: "pointer" }}
                      >
                        Back
                      </Link>
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      Hint
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      Image
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("nextReview")}
                        sx={{ cursor: "pointer" }}
                      >
                        Next Review
                      </Link>
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("level")}
                        sx={{ cursor: "pointer" }}
                      >
                        Level
                      </Link>
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("created")}
                        sx={{ cursor: "pointer" }}
                      >
                        Created
                      </Link>
                    </TableCell>
                    <TableCell align="center">Tools</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayDeck.map((card) => (
                    <TableRow key={card.front}>
                      <TableCell align="center" width="120px">
                        {card.front}
                      </TableCell>
                      <TableCell align="center">{card.back}</TableCell>
                      <TableCell align="center" className={classes.hint}>
                        {card.hint}
                      </TableCell>
                      <TableCell className={classes.hideCol} align="center">
                        {card.image && (
                          <Box
                            sx={{
                              overflow: "hidden",
                              width: "100px",
                              height: "80px",
                              display: "flex",
                              border: card.image[2] && "2px solid #5c5c5c",
                              borderRadius: "4px",
                              padding: "1px",
                              ":hover": { borderColor: "white" },
                            }}
                          >
                            {card.image[2] && (
                              <img
                                alt="hint"
                                onClick={() => toggleModal(card.image[2])} //expand image to be visible
                                src={card.image[2]}
                                style={{
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {readableDate(card.nextReview)}
                      </TableCell>
                      <TableCell className={classes.hideCol} align="center">
                        {card.level}
                      </TableCell>
                      <TableCell className={classes.hideCol} align="center">
                        {readableDate(card.created)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          onClick={() => handleEditCard(card)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
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
          <Box className={classes.buttonBox}>
            <Button variant="contained" onClick={() => onImportExport()}>
              Import / Upload
            </Button>
            <Button variant="contained" onClick={() => onLeaveBrowser()}>
              Go Back
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete your deck?")
                )
                  if (
                    window.confirm(
                      "Are you REALLY sure you want to DELETE your DECK?"
                    )
                  )
                    setDeck([]); // Set deck to empty array
              }}
            >
              Delete Deck
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default ViewDeck;
