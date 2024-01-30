import {
  Button,
  Typography,
  TextField,
  Box,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
import { Deck } from "../../App";
import GenerateImage from "./GenerateImage";
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
  onRemovePair: (source: string) => void;
};

const AddFlashcard: React.FC<AddCardProps> = ({
  pair,
  meaning,
  examples,
  onCardSubmit,
  deck,
  onSearchDef,
  onRemovePair,
}) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);
  const [disableButton, setDisable] = useState(true);
  const [imageLink, setImage] = useState("");
  const [imgData, setImgData] = useState([{ title: "", link: "" }]);
  const minWidth1 = 28 + input1.length * 33;
  const minWidth2 = 28 + input2.length * 16;
  const existingCard = deck.findIndex((card) => card.front === input1) !== -1;

  const handleSwapInputs = () => {
    setInput1(input2);
    setInput2(input1);
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
      onRemovePair(input1);
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
  }, []);
  console.log(imageLink);

  return (
    <div>
      {imgData[0].link === "" ? (
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
          {/* <Box
            sx={{
              height: 350,
              width: 525,
            }}
          >
            {imageLink && (
              <Box
                component="img"
                alt="Broken Link"
                src={imageLink}
                sx={{
                  height: 350,
                  width: 525,
                }}
              />
            )}
          </Box> */}

          <Button onClick={handleSwapInputs}>Swap Inputs</Button>
          <GenerateImage
            word={input1}
            onGenerate={(link: string) => setImage(link)}
            onItemList={(arr) => setImgData(arr)}
          />
          <Button onClick={() => setImage("")}>Remove Image</Button>
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
      ) : (
        <div>
          <ImageList sx={{ width: 1500, height: 800 }} cols={3} rowHeight={500}>
            {imgData.map((item) => (
              <ImageListItem key={item.link}>
                <img
                  srcSet={`${item.link}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.link}?w=164&h=164&fit=crop&auto=format`}
                  alt={""}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Button onClick={() => setImgData([{ title: "", link: "" }])}>
            Exit
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddFlashcard;
