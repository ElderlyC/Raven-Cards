import { Button, Typography, TextField, Box } from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
import { Deck } from "../../App";
// make meaning n examples editable? - some way to choose the hint for the card so it's not too obvious
// what is the purpose of meaning/examples? to give context for the flashcard answer. de-emphasise them.
// English front meaning search?
// define/ backend lang check code obsolete
// refactor: file too BIG
// better input width calc.
// naver dict search? - postman?
// -optional image generator button
// --extract code from TranslationPair, delete it (IMAGE generation)

type AddCardProps = {
  pair: WordPair;
  meaning: string;
  examples: { text: string; translatedText: string }[];
  onCardSubmit: () => void;
  deck: Deck;
  onSearchDef: (word: string) => void;
};

const AddFlashcard: React.FC<AddCardProps> = ({
  pair,
  meaning,
  examples,
  onCardSubmit,
  deck,
  onSearchDef,
}) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);
  const [disableButton, setDisable] = useState(true);
  const minWidth1 = 28 + input1.length * 33;
  const minWidth2 = 28 + input2.length * 16;
  const existingCard = deck.findIndex((card) => card.front === input1) !== -1;

  const handleSwapInputs = () => {
    setInput1(input2);
    setInput2(input1);
    setDisable(true);
    setTimeout(() => {
      onSearchDef(input1);
    }, 200);
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
      localStorage.setItem("deck", JSON.stringify([...deck, ...newCard]));
    }
    onCardSubmit();
  };

  useEffect(() => {
    setInput1(pair.source);
    setInput2(pair.target);
  }, [pair]);

  useEffect(() => {
    setTimeout(() => {
      setDisable(false);
    }, 2500);
  }, [input1]);

  console.log(disableButton);

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
            error={existingCard}
            helperText={existingCard && "Card already in deck."}
            inputProps={{
              style: {
                fontSize: "2rem",
                minWidth: "60px",
                width: `${minWidth1}px`,
                textAlign: "center",
              },
            }}
            id="source"
            variant="outlined"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
          />
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
            inputProps={{
              style: {
                fontSize: "2rem",
                width: `${minWidth2}px`,
                minWidth: "120px",
                textAlign: "center",
              },
            }}
            id="target"
            variant="outlined"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          />
        </Box>
      </Box>
      <Box>
        {
          <Typography>
            {meaning
              ? `Meaning: ${meaning}`
              : disableButton
              ? "Searching for Definition..."
              : "No definition found."}
          </Typography>
        }
        {examples[0]?.translatedText && (
          <Typography>Examples: {examples[0]?.translatedText}</Typography>
        )}
      </Box>
      <Button onClick={handleSwapInputs}>Swap Inputs</Button>
      <Button>Generate Image</Button>
      <Box>
        <Button
          disabled={existingCard || (meaning === "" && disableButton)}
          onClick={() => handleSubmitCard(false)}
        >
          Add New Card
        </Button>
        <Button onClick={() => handleSubmitCard(true)}>Cancel</Button>
      </Box>
    </div>
  );
};

export default AddFlashcard;
