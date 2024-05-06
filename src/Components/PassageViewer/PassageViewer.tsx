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
import TranslateIcon from "@mui/icons-material/Translate";
// import { enReg, koReg, jaReg } from "../../utilities";
import classes from "./PassageViewer.module.css";

// add flashcard function
// auto add example sentence (context sentence of a translated word)
// work on English text first! - single letters are not words
// lingq-like (use pic, check site)
// work for 한글 and Japanese chars - 안전하다 -> 안전하면서, 안전하고. edit words/click stem button to save 안전 to permalist, all words with stem are counted as known
// --add partial words (suffixes) to known words to make them display as plain text. e.g. 하면서 in 운동하면서 is plain text, 운동 as button
// highlighted words
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
  //const [reverse, setReverse] = useState(true);
  const pairlistArray: [string, string][] = Object.entries(pairlist);
  const [wordCount, setWordCount] = useState(pairlistArray.length);

  const [selectedText, setSelectedText] = useState("");

  const [sentenceView, setView] = useState(false);

  const sentenceArr = passage
    .replace(/\n/g, " ")
    .split(/([-a-zA-Z\s“,’—+]+[.!?”])/)
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

  useEffect(() => {
    setWordCount(pairlistArray.length);
    const container = document.getElementById("tablecontainer");
    if (container) container.scrollTo(0, container.scrollHeight);
  }, [pairlistArray]);

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
              <div key={index}>
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
            ))}
          {!sentenceView &&
            wordArr.map((word, index) =>
              isWord(word) ? (
                <Tooltip title={pairlist[word] || ""} key={index}>
                  <span
                    className={classes.wordSpan}
                    // color: word === "also" ? "green" : "",  // conditional colouring (known/unknown highlighting)
                    style={{}}
                    onClick={() => handleTranslate(word)}
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
