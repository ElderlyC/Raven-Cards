import { Button, Typography, TextField, Box } from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
// -opens a modal (hide other components, all in App.tsx)
// -optional image generator button
// --extract code from TranslationPair, delete it (IMAGE generation)
// -add button, cancel button

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

  const handleSwapInputs = () => {
    setInput1(input2);
    setInput2(input1);
  };

  const handleSearchDefinition = (word: string) => {
    onSearchDefinition(word);
  };

  const handleSubmitCard = (cancel: boolean) => {
    // save card data somewhere (local?)
    if (!cancel) {
      const newCard = [
        {
          front: input1,
          back: input2,
          created: new Date(),
          nextReview: "in 1hr",
          level: 0,
          example: examples[0]?.translatedText,
          meaning,
        },
      ];
      const stringDeck = localStorage.getItem("deck");
      const deck = stringDeck ? JSON.parse(stringDeck) : [];
      localStorage.setItem("deck", JSON.stringify([...deck, ...newCard]));
      console.log(deck);
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
        <Box>
          <Typography>Front:</Typography>
          <TextField
            id="source"
            variant="outlined"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />
          <Button onClick={() => handleSearchDefinition(input1)}>
            Search Definition
          </Button>
        </Box>
        <Box>
          <Typography>Back:</Typography>
          <TextField
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
