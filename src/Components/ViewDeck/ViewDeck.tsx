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
import { pageContent } from "./ViewDeckText";
// browser search function

type ViewDeckProps = {
  displayLang: string;
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
  displayLang,
}) => {
  const textContent = pageContent[displayLang];
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

          <Typography variant={"h2"}>{textContent.title}</Typography>
          <span>
            {textContent.total} {cardDeck.length}
          </span>
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
                        {textContent.front}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("back")}
                        sx={{ cursor: "pointer" }}
                      >
                        {textContent.back}
                      </Link>
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      {textContent.hint}
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      {textContent.image}
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("nextReview")}
                        sx={{ cursor: "pointer" }}
                      >
                        {textContent.nextReview}
                      </Link>
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("level")}
                        sx={{ cursor: "pointer" }}
                      >
                        {textContent.level}
                      </Link>
                    </TableCell>
                    <TableCell className={classes.hideCol} align="center">
                      <Link
                        underline="hover"
                        onClick={() => handleOrderBy("created")}
                        sx={{ cursor: "pointer" }}
                      >
                        {textContent.createdDate}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{textContent.tools}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayDeck.map((card) => (
                    <TableRow key={card.front}>
                      <TableCell
                        align="center"
                        width="120px"
                        className={classes.front}
                      >
                        {card.front}
                      </TableCell>
                      <TableCell align="center" className={classes.back}>
                        {card.back}
                      </TableCell>
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
                                alt={textContent.hint}
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
                      <TableCell
                        className={classes.hideCol}
                        align="center"
                        sx={{ width: "90px" }}
                      >
                        {card.level}
                      </TableCell>
                      <TableCell className={classes.hideCol} align="center">
                        {readableDate(card.created)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          sx={{ width: "80px" }}
                          variant="outlined"
                          onClick={() => handleEditCard(card)}
                        >
                          {textContent.edit}
                        </Button>
                        <Button
                          sx={{ width: "80px" }}
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            if (
                              window.confirm(
                                `${textContent.delConfirm} [${card.front}]`
                              )
                            ) {
                              handleDeleteCard(card);
                            }
                          }}
                        >
                          {textContent.del}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant={"h4"} sx={{ margin: "30px" }}>
              {textContent.noCards}
            </Typography>
          )}
          <Box className={classes.buttonBox}>
            <Button variant="contained" onClick={() => onImportExport()}>
              {textContent.import}
            </Button>
            <Button variant="contained" onClick={() => onLeaveBrowser()}>
              {textContent.home}
            </Button>
            <Button
              disabled={cardDeck.length === 0}
              variant="contained"
              color="error"
              onClick={() => {
                if (window.confirm(textContent.delDeckConfirm))
                  if (window.confirm(textContent.delDeckDoubleCheck))
                    setDeck([]); // Set deck to empty array
              }}
            >
              {textContent.delDeck}
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default ViewDeck;
