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
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { WordPair } from "../../types";
import { useState, useEffect, useRef } from "react";
import { Deck } from "../../App";
import { jaReg, koReg } from "../../utilities";
import GenerateImage from "./GenerateImage";
import classes from "./AddFlashcard.module.css";
import { pageContent } from "./AddFlashcardText";
// refactor: file TOO BIG - cut into sections
// different image search tool for english and japanese
// def switch button spacing?

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
  displayLang: string;
  onSendWords?: (word: string) => void;
  onFinishCard?: () => void;
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
  displayLang,
  onSendWords,
  onFinishCard,
}) => {
  const [input1, setInput1] = useState(pair.source);
  const [input2, setInput2] = useState(pair.target);
  const [disableButton, setDisable] = useState(true);
  const [imageLink, setImage] = useState(image ? image[2] : "");
  const [imgData, setImgData] = useState([
    { title: "", link: "", thumbnail: "" },
  ]);
  const kanji = hanja?.split(" ")[1];
  const furigana = hanja?.split(" ")[0];
  const [selected, setSelected] = useState("");

  const [definitionSearch, setSearch] = useState(true);
  const [hint, setHint] = useState("");
  const [zoom, setZoom] = useState(image ? image[0] : 1.0);
  const [verticalOffset, setVertical] = useState(image ? image[1] : 0);
  const existingCard = deck.findIndex((card) => card.front === input1) !== -1;
  const editingCardName = useRef(input1).current;

  const matches = useMediaQuery("(min-width:800px)");

  const textContent = pageContent[displayLang];
  const searchLang = (input: string) =>
    jaReg.test(input) ? "ja" : koReg.test(input) ? "ko" : "en";

  const handleSwapInputs = () => {
    setInput1(input2);
    setInput2(input1);
  };

  const handleSubmitCard = () => {
    const newCard = [
      {
        front: input1,
        back: input2,
        created: new Date(),
        nextReview: new Date(),
        level: 0,
        hint,
        image: [zoom, verticalOffset, imageLink],
        meaning,
      },
    ];
    localStorage.setItem("deck", JSON.stringify([...deck, ...newCard]));
    onRemovePair(input1);
    onFinishCard && onFinishCard();
  };

  const convertExample = (sentence: string) => {
    return sentence?.replace(/<b>(.*?)<\/b>/g, "[$1]");
  };

  const handleImageLink = (link: string) => {
    setImage(link);
    setImgData([{ title: "", link: "", thumbnail: "" }]);
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

  const handleSelectTranslation = () => {
    onSendWords && onSendWords("\n" + selected);
    setSelected("");
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

  useEffect(() => {
    const handleSelectionChange = () => {
      setSelected(window?.getSelection()?.toString().trim() || "");
    };
    document.body.addEventListener("touchend", handleSelectionChange);
    document.body.addEventListener("mouseup", handleSelectionChange);

    return () => {
      document.body.removeEventListener("touchend", handleSelectionChange);
      document.body.removeEventListener("mouseup", handleSelectionChange);
    };
  }, []);

  return (
    <div>
      {imgData[0].link === "" ? (
        <div className={classes.container}>
          <Typography variant={"h3"}>
            {editMode ? textContent.editTitle : textContent.newCardTitle}
          </Typography>
          <Box className={classes.inputSwap}>
            <Box className={classes.inputBox}>
              <TextField
                error={existingCard && !editMode}
                helperText={existingCard && !editMode && textContent.error}
                className={classes.front}
                id="source"
                label={textContent.frontLabel}
                variant="outlined"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
              />
            </Box>
            <Box className={classes.swapButton}>
              <Button onClick={handleSwapInputs}>
                <SwapVertIcon />
              </Button>
            </Box>
            <Box className={classes.inputBox}>
              <TextField
                className={classes.back}
                id="target"
                label={textContent.backLabel}
                variant="outlined"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
              />
            </Box>
          </Box>
          <Box className={classes.dataContainer}>
            <Box className={classes.meaning}>
              {meaning ? (
                <span>
                  {textContent.meaning}
                  {meaning}
                </span>
              ) : disableButton ? (
                textContent.searching
              ) : (
                textContent.noDef
              )}
            </Box>
            {imageLink && (
              <Box className={classes.imageButtons}>
                <div>
                  <Button
                    onClick={() => setVertical((p) => p + 5)}
                    variant="contained"
                  >
                    {textContent.upButton}
                  </Button>
                  <Button
                    onClick={() => {
                      setVertical(0);
                      setZoom(1);
                    }}
                    variant="contained"
                  >
                    {textContent.resetButton}
                  </Button>
                  <Button onClick={() => setImage("")} variant="outlined">
                    {textContent.removeButton}
                  </Button>
                </div>

                <Box className={classes.imageContainer}>
                  <img
                    style={{
                      height: "169px",
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
                <div>
                  <Button
                    onClick={() => setVertical((p) => p - 5)}
                    variant="contained"
                  >
                    {textContent.downButton}
                  </Button>
                  <Button
                    onClick={() => setZoom((p) => (p <= 1 ? 4 : p - 0.1))}
                    variant="contained"
                  >
                    {textContent.zoomOutButton}
                  </Button>
                </div>
              </Box>
            )}
            <Link
              href={
                searchLang(input1) === "ja"
                  ? `https://jisho.org/search/${input1}%23kanji`
                  : `https://hanja.dict.naver.com/#/search?query=${
                      kanji || furigana
                    }`
              }
              variant="h3"
              underline="hover"
              rel="noopener"
              target="_blank"
              className={classes.hanja}
            >
              {
                <Tooltip
                  followCursor
                  title={<span style={{ fontSize: "2rem" }}>{furigana}</span>}
                >
                  <span>
                    {kanji && <p style={{ margin: 0 }}>{furigana}</p>}
                  </span>
                </Tooltip>
              }
              {kanji || furigana}
            </Link>

            <Box className={classes.hintBox}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>
                  {textContent.hint}
                  <Link
                    href={
                      searchLang(input1) === "ja"
                        ? `https://jisho.org/search/${input1}%23sentences`
                        : `https://${searchLang(
                            input1
                          )}.dict.naver.com/#/search?range=example&query=${input1}`
                    }
                    underline="hover"
                    rel="noopener"
                    target="_blank"
                  >
                    {textContent.example}
                  </Link>
                </span>
                <TextField
                  value={hint || ""}
                  onChange={(e) => setHint(e.target.value)}
                  variant="standard"
                  className={classes.hint}
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
          <Box>
            <FormControlLabel
              sx={{ margin: "0 15px 0 5px" }}
              control={
                <Switch
                  checked={definitionSearch}
                  onChange={() => setSearch((p) => !p)}
                />
              }
              label={
                definitionSearch
                  ? textContent.imageType1
                  : textContent.imageType2
              }
            />
            {selected && (
              <Tooltip title={selected} followCursor placement="right">
                <Button onClick={handleSelectTranslation} variant="outlined">
                  <AddCircleIcon />
                </Button>
              </Tooltip>
            )}
            <GenerateImage
              word={
                definitionSearch
                  ? searchLang(input1) === "ja"
                    ? `${input1}+意味`
                    : searchLang(input1) === "ko"
                    ? `${input1}+뜻`
                    : `${input1}+definition`
                  : input1
              }
              onItemList={(arr) => setImgData(arr)}
              displayLang={displayLang}
            />
          </Box>
          {!editMode ? (
            <Box className={classes.submitButtons}>
              <Button
                size="large"
                variant="contained"
                disabled={existingCard || (meaning === "" && disableButton)}
                onClick={handleSubmitCard}
              >
                {textContent.addButton}
              </Button>
              <Button size="large" variant="outlined" onClick={onEndEditing}>
                {textContent.cancelButton}
              </Button>
            </Box>
          ) : (
            <Box className={classes.submitButtons}>
              <Button
                onClick={handleEditCard}
                size="large"
                variant="contained"
                sx={{ width: "110px" }}
              >
                {textContent.saveButton}
              </Button>
              <Button size="large" variant="outlined" onClick={onEndEditing}>
                {textContent.cancelButton}
              </Button>
            </Box>
          )}
        </div>
      ) : (
        <div>
          <ImageList
            cols={matches && imgData.length > 3 ? 3 : 1}
            rowHeight={imgData.length === 1 ? 794 : matches ? 450 : 200}
            className={classes.imageList}
            sx={{
              width: matches ? "80vw" : "90vw",
              height: matches ? "800px" : "90vh",
            }}
          >
            {imgData.map((item) => (
              <ImageListItem
                key={item.link}
                onClick={() =>
                  handleImageLink(
                    item.link.includes("http:") ? item.thumbnail : item.link
                  )
                }
              >
                {item.link && (
                  <img
                    className={classes.image}
                    style={{
                      objectFit: "contain",
                    }}
                    srcSet={
                      item.link.includes("http:") ? item.thumbnail : item.link
                    }
                    src={
                      item.link.includes("http:") ? item.thumbnail : item.link
                    }
                    alt={""}
                    loading="lazy"
                    onError={() => {
                      item.link = item.thumbnail;
                      setImgData([...imgData]);
                    }}
                  />
                )}
              </ImageListItem>
            ))}
          </ImageList>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setImgData([{ title: "", link: "", thumbnail: "" }]);
            }}
          >
            {textContent.exitButton}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddFlashcard;
