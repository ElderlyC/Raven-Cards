import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  TableHead,
  TableRow,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TranslateIcon from "@mui/icons-material/Translate";
import { pageContent } from "./PassageViewerText";
// import { enReg, koReg, jaReg } from "../../utilities";
import classes from "./PassageViewer.module.css";

// add flashcard function [addcard component OR send pairs to wordlist]
// -auto add example sentence (context sentence of a translated word)
// Text file <translations>
// collapsible wordlist
// work on English text first! - single letters are not words
// lingq-like (use pic, check site)
// work for 한글 and Japanese chars - 안전하다 -> 안전하면서, 안전하고. edit words/click stem button to save 안전 to permalist, all words with stem are counted as known
// --jp not considered words yet
// --add partial words (suffixes) to known words to make them display as plain text. e.g. 하면서 in 운동하면서 is plain text, 운동 as button
// highlighted words
// words are separated not by spaces but non-letters
// translated words are added to permalist, don't need to to be translated again
// fixed column widths

//for known words, compare to an array of 'known words', can click a word to make it known
//unknown words highlighted in blue
//deck card words in yellow - pull from APP.tsx

// custom font, text styling for enhanced reading
// image translation on home screen

const PassageViewer = ({ onExit, passage, sourceLang, deck, displayLang }) => {
  const textContent = pageContent[displayLang];
  const cardListObj = deck.reduce((acc, card) => {
    const { front, back } = card;
    return { ...acc, [front]: back };
  }, {});

  //split up 'words' based on passage language - "can't" "한국어를" "関西弁で"＋"喋る" (spaces + particles)
  const langList = ["en", "ko", "ja"].filter((lang) => lang !== sourceLang);
  const [langs, setLangs] = useState(langList);
  const langNames = {
    en: textContent.language1,
    ko: textContent.language2,
    ja: textContent.language3,
  };

  const [pairlist, setPairlist] = useState({});
  //const [reverse, setReverse] = useState(true);
  const pairlistArray: [string, string][] = Object.entries(pairlist);
  const [wordCount, setWordCount] = useState(pairlistArray.length);

  const [selectedText, setSelectedText] = useState("");

  const [sentenceView, setView] = useState(false);

  const storedWords = localStorage.getItem("seenWords");
  const [seenWords, setSeenWords] = useState(
    storedWords ? JSON.parse(storedWords) : {}
  );

  const sentenceArr = passage
    .replace(/\n/g, " ")
    .split(/([^.?!]+[.?!]+[”]?)/)
    .filter((sentence) => sentence?.trim()?.length > 0); // lookahead removed (not supported by safari)

  const wordArr = passage
    .split(/([\w가-힣’]+)/) // need different regex for jp text
    .filter(Boolean);

  //should probably be different dependent on sourceLang or lang of word
  const isWord = (word) => /^[a-zA-Z’]+$/u.test(word);

  const handleTranslate = async (word: string) => {
    if (!word) return;
    if (pairlist[word]) {
      const refresh = pairlist[word];
      delete pairlist[word];
      setPairlist((prevPairlist) => ({
        ...prevPairlist,
        [word]: refresh,
      }));
      return;
    }

    setPairlist((prevPairlist) => ({
      ...prevPairlist,
      [word]: textContent.loading,
    }));

    try {
      const response = await axios.post<{
        translation: string;
      }>(
        "https://australia-southeast1-ko-en-cards.cloudfunctions.net/Ko-En-Cards",
        { source: sourceLang, target: langs[0], text: word }
      );

      setPairlist((prevPairlist) => ({
        ...prevPairlist,
        [word]: response.data.translation,
      }));
      // Add to permalist here for future recognition, un/known typing
      setSeenWords((list) => ({
        ...list,
        [word]: response.data.translation,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLangShuffle = () => {
    setLangs(([lang1, lang2]) => [lang2, lang1]);
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(selection?.toString() || "");
  };

  const handleKeyDown = (event) => {
    if (event.key === "t" || event.key === "T") handleTranslate(selectedText);
  };

  useEffect(() => {
    setWordCount(pairlistArray.length);
    const container = document.getElementById("tablecontainer");
    if (container) container.scrollTo(0, container.scrollHeight);
  }, [pairlistArray]);

  useEffect(() => {
    localStorage.setItem("seenWords", JSON.stringify(seenWords));
  }, [seenWords]);

  return (
    <Box className={classes.container}>
      <Box sx={{ flex: 4 }}>
        <Typography variant="h2">{textContent.passage}</Typography>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title={textContent.translateTooltip}>
            <Button onClick={() => handleTranslate(selectedText)}>
              <TranslateIcon />
            </Button>
          </Tooltip>

          <span style={{ margin: "5px" }}>{langNames[sourceLang]}</span>
          {<TrendingFlatIcon sx={{ height: "100%" }} />}
          <Button
            size="large"
            onClick={handleLangShuffle}
            sx={{ textTransform: "none", fontSize: "1.3rem", padding: "5px" }}
          >
            {langNames[langs[0]]}
          </Button>
        </Typography>
        <Box
          className={classes.scroll}
          onMouseUp={handleSelection}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {sentenceView &&
            sentenceArr.map((sentence, index) => (
              <Tooltip
                title={pairlist[sentence] || ""}
                key={index}
                placement="top"
              >
                <div>
                  <span
                    className={classes.sentenceSpan}
                    onClick={() => handleTranslate(sentence)}
                  >
                    {sentence}
                  </span>
                  {index !== sentenceArr.length - 1 && (
                    <div className={classes.sentenceDivider}></div>
                  )}
                </div>
              </Tooltip>
            ))}
          {!sentenceView &&
            wordArr.map((word, index) =>
              isWord(word) ? (
                <Tooltip
                  title={
                    cardListObj[word]
                      ? cardListObj[word]
                      : seenWords[word.toLowerCase()] || ""
                  }
                  key={index}
                >
                  <span
                    className={classes.wordSpan}
                    // conditional colouring (known/unknown highlighting)
                    style={{
                      color: cardListObj[word]
                        ? "yellow"
                        : seenWords[word.toLowerCase()]
                        ? "#90caf9"
                        : "",
                    }}
                    onClick={() => handleTranslate(word.toLowerCase())}
                  >
                    {word}
                  </span>
                </Tooltip>
              ) : (
                <span key={index}>{word}</span>
              )
            )}
        </Box>
        <Button variant="contained" onClick={() => setView((p) => !p)}>
          {sentenceView ? "Passage View" : "Sentence View"}
        </Button>
        <Button onClick={onExit} variant="contained">
          Exit
        </Button>
      </Box>

      <Box className={classes.wordList}>
        <Typography variant="h2" className={classes.listTitle}>
          Word List
        </Typography>
        <TableContainer className={classes.tableContainer} id="tablecontainer">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={110}>Words ({wordCount})</TableCell>
                <TableCell>Translation</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairlistArray.map(([word, translation], index) => (
                <TableRow key={index}>
                  <TableCell>{word}</TableCell>
                  <TableCell>{translation}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        const newList = { ...pairlist };
                        delete newList[word];
                        setPairlist(newList);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default PassageViewer;
