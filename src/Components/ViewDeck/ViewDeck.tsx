import React, { useState } from "react";
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
import { Deck } from "../../App";
// Deck cards put together into a table
// Word / Translation / Definition / Next Review Date / Level / ImageLink etc.
// format it to be pretty + fit on mobile

type ViewDeckProps = {
  deck: Deck;
  onLeaveBrowser: () => void;
};

const ViewDeck: React.FC<ViewDeckProps> = ({ onLeaveBrowser, deck }) => {
  const [cardDeck, setDeck] = useState(deck || []);

  const readableDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      hour12: false,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div style={{ width: "80%", maxWidth: "1000px" }}>
      <Typography variant={"h2"}>Browse Deck</Typography>
      <TableContainer component={Paper} sx={{ maxHeight: "600px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Front</TableCell>
              <TableCell>Back</TableCell>
              <TableCell>Definition</TableCell>
              <TableCell>Example</TableCell>
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
                <TableCell>{card.meaning}</TableCell>
                <TableCell>{card.example}</TableCell>
                <TableCell>{readableDate(card.nextReview)}</TableCell>
                <TableCell>{card.level}</TableCell>
                <TableCell>{readableDate(card.created)}</TableCell>
                <TableCell>
                  <Button>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => onLeaveBrowser()}>Go Back</Button>
    </div>
  );
};

export default ViewDeck;
