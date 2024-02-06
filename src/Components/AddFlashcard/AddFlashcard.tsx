import {
  Button,
  Typography,
  TextField,
  Box,
  ImageList,
  ImageListItem,
  FormControlLabel,
  Switch,
  Link,
} from "@mui/material";
import { WordPair } from "../../types";
import { useState, useEffect } from "react";
import { Deck } from "../../App";
import GenerateImage from "./GenerateImage";
// show image as hint on review
// English front meaning search?
// define/ backend lang check code obsolete
// refactor: file too BIG
// empty tiles in image list
// choose image from list, added to card

type AddCardProps = {
  pair: WordPair;
  meaning: string;
  examples: { text: string; translatedText: string }[];
  hanja: string;
  onCardSubmit: () => void;
  deck: Deck;
  onRemovePair: (source: string) => void;
};

const AddFlashcard: React.FC<AddCardProps> = ({
  pair,
  meaning,
  examples,
  hanja,
  onCardSubmit,
  deck,
  onRemovePair,
}) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);
  const [disableButton, setDisable] = useState(true);
  const [imageLink, setImage] = useState("");
  const [imgData, setImgData] = useState([{ title: "", link: "" }]);
  const [definitionSearch, setSearch] = useState(true);
  const [hint, setHint] = useState("");
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
          hint,
        },
      ];
      localStorage.setItem("deck", JSON.stringify([...deck, ...newCard]));
      onRemovePair(input1);
    }
    onCardSubmit();
  };

  const convertExample = (sentence: string) => {
    return sentence.replace(/<b>(.*?)<\/b>/g, "[$1]");
  };

  useEffect(() => {
    setInput1(pair.source);
    setInput2(pair.target);
  }, [pair]);

  useEffect(() => {
    setTimeout(() => {
      setDisable(false);
    }, 2500);
    setHint(convertExample(examples[0]?.text));
  }, [examples]);

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
                    fontSize: "3rem",
                    width: "300px",
                    textAlign: "center",
                    lineHeight: "3.5rem",
                  },
                }}
                multiline
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
                    width: "300px",
                    textAlign: "center",
                    lineHeight: "2.5rem",
                  },
                }}
                id="target"
                variant="outlined"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              width: "500px",
            }}
          >
            <Box sx={{ margin: "15px" }}>
              {meaning ? (
                <span>
                  Meaning <br />
                  {meaning}
                </span>
              ) : disableButton ? (
                "Searching for Definition..."
              ) : (
                "No definition found."
              )}
            </Box>

            <Link
              href={"https://hanja.dict.naver.com/#/search?query=" + hanja}
              variant="h3"
              underline="hover"
              rel="noopener"
              target="_blank"
            >
              {hanja}
            </Link>

            <Box sx={{ margin: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>
                  Hint{" "}
                  <Link
                    href={
                      "https://ko.dict.naver.com/#/search?range=example&query=" +
                      input1
                    }
                    underline="hover"
                    rel="noopener"
                    target="_blank"
                  >
                    예
                  </Link>
                </span>
                <TextField
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  variant="standard"
                  inputProps={{
                    sx: { fontSize: "1.5rem", textAlign: "center" },
                  }}
                />
                <span>
                  {convertExample(examples[0].text) === hint
                    ? examples[0]?.translatedText
                    : ""}
                </span>
              </div>
            </Box>
          </Box>

          <Button onClick={handleSwapInputs}>Swap Inputs</Button>

          <FormControlLabel
            control={
              <Switch
                checked={definitionSearch}
                onChange={() => setSearch((p) => !p)}
              />
            }
            label={definitionSearch ? "Definition" : "General"}
          />

          <GenerateImage
            word={definitionSearch ? input1 + "+뜻" : input1}
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
              <ImageListItem
                key={item.link}
                onClick={() => console.log(item.link)}
              >
                <img
                  srcSet={`${item.link}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.link}?w=164&h=164&fit=crop&auto=format`}
                  alt={""}
                  // loading="lazy"
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
