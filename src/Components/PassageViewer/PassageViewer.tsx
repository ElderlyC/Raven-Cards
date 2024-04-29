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
import { enReg, koReg, jaReg } from "../../utilities";
import classes from "./PassageViewer.module.css";

// work on English text first!
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

const PassageViewer = ({ onExit, passage }) => {
  //split up 'words' based on passage language - "can't" "한국어를" "関西弁で"＋"喋る" (spaces + particles)

  const [langs, setLangs] = useState(["en", "ko", "ja"]);
  const langNames = { en: "English", ko: "Korean", ja: "Japanese" };

  const [pairlist, setPairlist] = useState({});
  const pairlistArray: [string, string][] = Object.entries(pairlist);

  // make sentence array for alternate view (sentence view)
  const wordArr = passage
    .split(/([\w\p{Script=Hangul}]+|[^\w\s])/u) // need different regex for jp text
    .filter(Boolean);

  //should probably be different dependent on lang of word
  const isWord = (word) => /^[\p{L}]+$/u.test(word);

  const handleTranslate = async (word: string) => {
    if (pairlist[word]) return;

    setPairlist((prevPairlist) => ({
      ...prevPairlist,
      [word]: "Loading...",
    }));

    try {
      const response = await axios.post<{
        translation: string;
      }>(
        "https://australia-southeast1-ko-en-cards.cloudfunctions.net/Ko-En-Cards",
        { source: langs[0], target: langs[1], text: word }
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
    setLangs(([lang1, lang2, lang3]) => [lang2, lang1, lang3]);
  };

  console.log(wordArr);

  return (
    <Box className={classes.container}>
      <Box sx={{ flex: 4 }}>
        <Typography variant="h2">Passage</Typography>
        <Typography variant="h6">
          <span>Translating to </span>
          <Button size="large" onClick={handleLangShuffle}>
            {langNames[langs[1]]}
          </Button>
        </Typography>
        <Box className={classes.scroll}>
          {wordArr.map((word, index) =>
            //sorting of word/non word done outside return
            // word === "." && wordArr[index + 1] === " " ? (
            //   <Box />
            // ) :
            isWord(word) ? (
              <Tooltip title={pairlist[word] || ""} key={index}>
                <Button
                  style={{
                    fontSize: "1.5rem",
                    textTransform: "none",
                    minWidth: "20px",
                    padding: "0",
                  }}
                  variant="text"
                  onClick={() => handleTranslate(word)}
                >
                  {word}
                </Button>
              </Tooltip>
            ) : (
              <span style={{ fontSize: "1.5rem" }}>{word}</span>
            )
          )}
        </Box>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {pairlistArray.reverse().map(([word, translation]) => (
                <TableRow>
                  <TableCell>{word}</TableCell>
                  <TableCell>{translation}</TableCell>
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
