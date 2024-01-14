import { Button, Typography, TextField, Box } from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
// papago define used when a new card is created (attempt to get definition =meaning+examples)
// -new flashcard button
// --opens a modal (hide other components, all in App.tsx)
// --optional image generator button
// -extract code from TranslationPair, delete it

type AddCardProps = {
  pair: WordPair;
  meaning: string;
  examples: { text: string; translatedText: string }[];
  onSearchDefinition: (input1: string) => void;
};

const AddFlashcard: React.FC<AddCardProps> = ({
  pair,
  meaning,
  examples,
  onSearchDefinition,
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

  useEffect(() => {
    setInput1(pair.source);
    setInput2(pair.target);
  }, [pair]);

  return (
    <div>
      AddFlashcardModal
      <Typography>New Card</Typography>
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
        <Typography>Meaning: {meaning}</Typography>
        {examples && (
          <Typography>Examples: {examples[0]?.translatedText}</Typography>
        )}
      </Box>
      <Button onClick={handleSwapInputs}>Swap Inputs</Button>
      <Button>Generate Image</Button>
    </div>
  );
};

export default AddFlashcard;
