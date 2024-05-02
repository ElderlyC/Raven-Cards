import { useState } from "react";
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
import TranslateIcon from "@mui/icons-material/Translate";
import { enReg, koReg, jaReg } from "../../utilities";
import classes from "./PassageViewer.module.css";

// auto add example sentence (context sentence of a translated word)
// work on English text first! - single letters are not words
// sentence separator
// lingq-like (use pic, check site)
// work for 한글 and Japanese chars - 안전하다 -> 안전하면서, 안전하고. edit words/click stem button to save 안전 to permalist, all words with stem are counted as known
// --add partial words (suffixes) to known words to make them display as plain text. e.g. 하면서 in 운동하면서 is plain text, 운동 as button
// highlighted words
// translate by sentence (sentence separation)
// -cut sentence tool (click final word in sentence to divide)
// words are separated not by spaces but non-letters
// translated words are added to permalist, don't need to to be translated again
// fixed column widths

//for known words, compare to an array of 'known words', can click a word to make it known
//unknown words highlighted in blue
//card words in yellow

const PassageViewer = ({ onExit, passage, sourceLang }) => {
  //split up 'words' based on passage language - "can't" "한국어를" "関西弁で"＋"喋る" (spaces + particles)
  const langList = ["en", "ko", "ja"].filter((lang) => lang !== sourceLang);
  const [langs, setLangs] = useState(langList);
  const langNames = { en: "English", ko: "Korean", ja: "Japanese" };

  const [pairlist, setPairlist] = useState({});
  const pairlistArray: [string, string][] = Object.entries(pairlist);

  const [selectedText, setSelectedText] = useState("");

  const [sentenceView, setView] = useState(false);

  // make sentence array for alternate view (sentence view)
  const sentenceArr = passage
    .split(/(?<=[.!?”])\s+|\s+(?=\[)/)
    .filter((sentence) => sentence.length > 1);

  //console.log(sentenceArr);
  const wordArr = passage
    .split(/([\w\p{Script=Hangul}]+|[^\w\s])/u) // need different regex for jp text
    .filter(Boolean);

  //should probably be different dependent on lang of word
  const isWord = (word) => /^[\p{L}]+$/u.test(word);

  const handleTranslate = async (word: string) => {
    if (pairlist[word]) return;
    if (!word) return;

    setPairlist((prevPairlist) => ({
      ...prevPairlist,
      [word]: "Loading...",
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

  return (
    <Box className={classes.container}>
      <Box sx={{ flex: 4 }}>
        <Typography variant="h2">Passage</Typography>
        <Typography variant="h6">
          <Tooltip title="Highlight text then press T to translate your selection">
            <Button onClick={() => handleTranslate(selectedText)}>
              <TranslateIcon />
            </Button>
          </Tooltip>

          <span>Translating {langNames[sourceLang]} to </span>
          <Button size="large" onClick={handleLangShuffle}>
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
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    fontSize: "1.5rem",
                    borderRadius: "3px",
                  }}
                  className={classes.sentenceSpan}
                  key={index}
                  onClick={() => handleTranslate(sentence)}
                >
                  {sentence}
                </span>
              </div>
            ))}
          {!sentenceView &&
            wordArr.map((word, index) =>
              //sorting of word/non word done outside return
              // word === "." && wordArr[index + 1] === " " ? (
              //   <Box />
              // ) :
              isWord(word) ? (
                <Tooltip title={pairlist[word] || ""} key={index}>
                  <span
                    className={classes.wordSpan}
                    style={{
                      fontSize: "1.5rem",
                      minWidth: "20px",
                      borderRadius: "3px",
                      // color: word === "also" ? "green" : "",  // conditional colouring (known/unknown highlighting)
                    }}
                    onClick={() => handleTranslate(word)}
                  >
                    {word}
                  </span>
                </Tooltip>
              ) : (
                <span style={{ fontSize: "1.5rem" }} key={index}>
                  {word}
                </span>
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

      <Box sx={{ flex: 2, margin: "20px 20px 20px 80px" }}>
        <Typography variant="h4" margin={"20px 0"}>
          Word List
        </Typography>
        <TableContainer sx={{ maxHeight: 535, border: "1px white solid" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Word</TableCell>
                <TableCell>Translation</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairlistArray.reverse().map(([word, translation], index) => (
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
