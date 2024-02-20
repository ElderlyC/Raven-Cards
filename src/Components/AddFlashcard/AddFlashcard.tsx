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
import { useState, useEffect, useRef } from "react";
import { Deck } from "../../App";
import GenerateImage from "./GenerateImage";
// define/ backend lang check code obsolete
// refactor: file TOO BIG

type AddCardProps = {
  image?: [zoom: number, verticalOffset: number, imageLink: string];
  editMode: boolean;
  pair: WordPair;
  meaning: string;
  examples: { text: string; translatedText: string }[];
  hanja: string;
  onEndEditing: () => void;
  deck: Deck;
  onRemovePair: (source: string) => void;
};

const AddFlashcard: React.FC<AddCardProps> = ({
  image,
  editMode,
  pair,
  meaning,
  examples,
  hanja,
  onEndEditing,
  deck,
  onRemovePair,
}) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);
  const [disableButton, setDisable] = useState(true);
  const [imageLink, setImage] = useState(image ? image[2] : "");
  const [imgData, setImgData] = useState([{ title: "", link: "" }]);
  const [definitionSearch, setSearch] = useState(true);
  const [hint, setHint] = useState("");
  const [zoom, setZoom] = useState(image ? image[0] : 1.0);
  const [verticalOffset, setVertical] = useState(image ? image[1] : 0);
  const existingCard = deck.findIndex((card) => card.front === input1) !== -1;
  const editingCardName = useRef(input1).current;

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
          image: [zoom, verticalOffset, imageLink],
        },
      ];
      localStorage.setItem("deck", JSON.stringify([...deck, ...newCard]));
      onRemovePair(input1);
    }
    onEndEditing();
  };

  const convertExample = (sentence: string) => {
    return sentence?.replace(/<b>(.*?)<\/b>/g, "[$1]");
  };

  const handleImageLink = (link: string) => {
    setImage(link);
    setImgData([{ title: "", link: "" }]);
  };

  const handleEditCard = () => {
    const cardIndex = deck.findIndex((card) => card.front === editingCardName);
    deck[cardIndex].front = input1;
    deck[cardIndex].back = input2;
    deck[cardIndex].hint = hint;
    deck[cardIndex].image = [zoom, verticalOffset, imageLink];

    localStorage.setItem("deck", JSON.stringify(deck));
    onEndEditing();
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
  }, [examples, input1]); //input1 necessary?

  return (
    <div>
      {imgData[0].link === "" ? (
        <div>
          <Typography variant={"h3"}>
            {editMode ? "Editing Card" : "New Card"}
          </Typography>
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
                error={existingCard && !editMode}
                helperText={
                  existingCard && !editMode && "Card already in deck."
                }
                inputProps={{
                  style: {
                    fontSize: "3rem",
                    width: "300px",
                    textAlign: "center",
                    lineHeight: "3.5rem",
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
                  {"Meaning: "}
                  {meaning}
                </span>
              ) : disableButton ? (
                "Searching for Definition..."
              ) : (
                "No definition found."
              )}
            </Box>
            {imageLink && (
              <Box>
                <Button
                  onClick={() => setVertical((p) => p + 5)}
                  variant="contained"
                >
                  Up
                </Button>
                <Button
                  onClick={() => {
                    setVertical(0);
                    setZoom(1);
                  }}
                  variant="contained"
                >
                  Reset
                </Button>
                <Box
                  sx={{
                    overflow: "hidden",
                    cursor: "zoom-in",
                    height: "169px",
                  }}
                >
                  <img
                    style={{
                      height: "169px",
                      objectFit: "cover",
                      scale: zoom.toString(),
                      marginTop: `${verticalOffset}%`,
                    }}
                    srcSet={imageLink}
                    src={imageLink}
                    alt={""}
                    onClick={() => setZoom((p) => (p > 4 ? 1 : p + 0.1))}
                    loading="lazy"
                  />
                </Box>
                <Button
                  onClick={() => setVertical((p) => p - 5)}
                  variant="contained"
                >
                  Down
                </Button>
                <Button
                  onClick={() => setZoom((p) => (p <= 1 ? 4 : p - 0.1))}
                  variant="contained"
                >
                  Zoom-Out
                </Button>
              </Box>
            )}

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
                    href={`https://${
                      /[a-zA-Z+]/.test(input1) ? "en" : "ko"
                    }.dict.naver.com/#/search?range=example&query=${input1}`}
                    underline="hover"
                    rel="noopener"
                    target="_blank"
                  >
                    예
                  </Link>
                </span>
                <TextField
                  value={hint || ""}
                  onChange={(e) => setHint(e.target.value)}
                  variant="standard"
                  inputProps={{
                    sx: { fontSize: "1.5rem", textAlign: "center" },
                  }}
                />
                <span>
                  {convertExample(examples[0]?.text) === hint
                    ? examples[0]?.translatedText
                    : examples[0]?.translatedText === hint
                    ? convertExample(examples[0]?.text)
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
            word={
              definitionSearch
                ? /[a-zA-Z+]/.test(input1)
                  ? input1 + "+definition"
                  : input1 + "+뜻"
                : input1
            }
            onItemList={(arr) => setImgData(arr)}
          />
          <Button onClick={() => setImage("")}>Remove Image</Button>
          {!editMode ? (
            <Box>
              <Button
                size="large"
                variant="contained"
                disabled={existingCard || (meaning === "" && disableButton)}
                onClick={() => handleSubmitCard(false)}
              >
                Add New Card
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => handleSubmitCard(true)}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                onClick={handleEditCard}
                size="large"
                variant="contained"
                sx={{ width: "110px" }}
              >
                Save
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => onEndEditing()}
              >
                Cancel
              </Button>
            </Box>
          )}
        </div>
      ) : (
        <div>
          <ImageList sx={{ width: 1500, height: 800 }} cols={3} rowHeight={500}>
            {imgData.map((item) => (
              <ImageListItem
                key={item.link}
                onClick={() => handleImageLink(item.link)}
              >
                {item.link && (
                  <img
                    srcSet={item.link}
                    src={item.link}
                    alt={""}
                    loading="lazy"
                  />
                )}
              </ImageListItem>
            ))}
          </ImageList>
          <Button
            onClick={() => {
              setImgData([{ title: "", link: "" }]);
            }}
          >
            Exit
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddFlashcard;
