import { Button, Typography, TextField, Box } from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
// -optional image generator button
// --extract code from TranslationPair, delete it (IMAGE generation)

type AddCardProps = {
  pair: WordPair;
  meaning: string;
  examples: { text: string; translatedText: string }[];
  onSearchDefinition: (input1: string) => void;
  onCardSubmit: () => void;
};

const AddFlashcard: React.FC<AddCardProps> = ({
  pair,
  meaning,
  examples,
  onSearchDefinition,
  onCardSubmit,
}) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);
  const minWidth1 = 28 + input1.length * 33;
  const minWidth2 = 28 + input2.length * 15;

  const handleSwapInputs = () => {
    setInput1(input2);
    setInput2(input1);
  };

  const handleSearchDefinition = (word: string) => {
    onSearchDefinition(word);
  };

  const handleSubmitCard = (cancel: boolean) => {
    if (!cancel) {
      const newCard = [
        {
          front: input1,
          back: input2,
          created: new Date(),
          nextReview: new Date(),
          level: 0,
          example: examples[0]?.translatedText,
          meaning,
        },
      ];
      const stringDeck = localStorage.getItem("deck");
      const deck = stringDeck ? JSON.parse(stringDeck) : [];
      localStorage.setItem("deck", JSON.stringify([...deck, ...newCard]));
    }
    onCardSubmit();
  };

  useEffect(() => {
    setInput1(pair.source);
    setInput2(pair.target);
  }, [pair]);

  useEffect(() => {
    setInput1(pair.source);
    setInput2(pair.target);
  }, [pair]);

  return (
    <div>
      <Typography variant={"h2"}>New Card</Typography>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px",
          }}
        >
          <Typography variant={"h4"}>Front:</Typography>
          <TextField
            InputProps={{
              style: {
                fontSize: "2rem",
                minWidth: "60px",
                width: `${minWidth1}px`,
              },
            }}
            id="source"
            variant="outlined"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />
          <Button onClick={() => handleSearchDefinition(input1)}>
            Search Definition
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px",
          }}
        >
          <Typography variant={"h4"}>Back:</Typography>
          <TextField
            InputProps={{
              style: {
                fontSize: "2rem",
                width: `${minWidth2}px`,
                minWidth: "120px",
              },
            }}
            id="target"
            variant="outlined"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          />
          <Button onClick={() => handleSearchDefinition(input2)}>
            Search Definition
          </Button>
        </Box>
      </Box>
      <Box>
        {meaning && <Typography>Meaning: {meaning}</Typography>}
        {examples[0]?.translatedText && (
          <Typography>Examples: {examples[0]?.translatedText}</Typography>
        )}
      </Box>
      <Button onClick={handleSwapInputs}>Swap Inputs</Button>
      <Button>Generate Image</Button>
      <Box>
        <Button onClick={() => handleSubmitCard(false)}>Add New Card</Button>
        <Button onClick={() => handleSubmitCard(true)}>Cancel</Button>
      </Box>
    </div>
  );
};

export default AddFlashcard;
