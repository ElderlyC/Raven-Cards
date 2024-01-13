import { Button, Typography, TextField, Box } from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
// papago define used when a new card is created (attempt to get definition =meaning+examples)
// -new flashcard button
// --opens a modal (hide other components, all in App.tsx)
// --autofills inputs using source and target from WordPair
// --auto generates a meaning/examples
// --optional image generator button
// --swap inputs button
// -extract code from TranslationPair, delete it

type AddCardProps = {
  pair: WordPair;
  meaning: string;
  examples: { text: string; translatedText: string }[];
};

const AddFlashcard: React.FC<AddCardProps> = ({ pair, meaning, examples }) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);

  const handleSwap = () => {
    setInput1(input2);
    setInput2(input1);
  };

  useEffect(() => {
    setInput1(pair.source);
    setInput2(pair.target);
  }, [pair]);

  return (
    <div>
      AddFlashcardModal
      <Typography>{pair.source + pair.target}</Typography>
      <Box>
        <TextField id="source" variant="outlined" value={input1} />
        <TextField id="target" variant="outlined" value={input2} />
      </Box>
      <Box>
        <Typography>Meaning: {meaning}</Typography>
        {examples && (
          <Typography>Examples: {examples[0]?.translatedText}</Typography>
        )}
      </Box>
      <Button onClick={handleSwap}>Swap Inputs</Button>
      <Button>Generate Image</Button>
    </div>
  );
};

export default AddFlashcard;
