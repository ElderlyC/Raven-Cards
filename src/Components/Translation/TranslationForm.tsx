import React, { useState, useEffect, FormEvent } from "react";
import { WordPair } from "../../types";
import { TextField, Button, Typography, Box } from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { enReg, koReg, jaReg } from "../../utilities";
import { pageContent } from "./TranslationText";
import axios from "axios";
import classes from "./TranslationForm.module.css";

type TranslationFormTypes = {
  displayLang: string;
  onTranslation: ({ source, target }: WordPair) => void;
  smallScreen: boolean;
  initialWords: string;
  onTextChange: (text: string) => void;
  onConvert: (sourceLang: string, passage: string) => void;
};

const TranslationForm: React.FC<TranslationFormTypes> = ({
  displayLang,
  onTranslation,
  smallScreen,
  initialWords,
  onTextChange,
  onConvert,
}) => {
  const [text, setText] = useState(initialWords || "");
  const [langs, setLangs] = useState(["ko", "en", "ja"]);
  const [loading, setLoading] = useState(false);
  const [changedIcon, setChangeIcon] = useState(false);
  const [form, setForm] = useState(true); // default translation form

  const {
    title,
    title2,
    language1,
    language2,
    language3,
    inputLabel,
    placeholder,
    placeholder2,
    translating,
    translate,
    convert,
  } = pageContent[displayLang];

  const langNames = { en: language1, ko: language2, ja: language3 };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
    if (!form) onConvert(langs[0], text);
    else {
      setLoading(true);
      try {
        const response = await axios.post<{
          translation: string;
        }>(
          "https://australia-southeast1-ko-en-cards.cloudfunctions.net/Ko-En-Cards",
          { source: langs[0], target: langs[1], text: text }
        );
        onTranslation({ source: text, target: response.data.translation });
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    setText("");
    onTextChange("");
  };

  const handleShuffle = (index: number) => {
    if (index === 0) setLangs(([lang1, lang2, lang3]) => [lang3, lang2, lang1]);
    else setLangs(([lang1, lang2, lang3]) => [lang1, lang3, lang2]);
  };

  const handleSwap = () => {
    setLangs(([lang1, lang2, lang3]) => [lang2, lang1, lang3]);
  };

  const handleTextChange = (e) => {
    // save changes to the inital words
    onTextChange(e.target.value);
    const lastChar = e.target.value.slice(-1);

    if (koReg.test(lastChar) && langs[0] !== "ko") setLangs(["ko", "en", "ja"]);
    if (jaReg.test(lastChar) && langs[0] !== "ja") setLangs(["ja", "en", "ko"]);
    if (enReg.test(lastChar) && langs[0] !== "en") setLangs(["en", "ko", "ja"]);
    setText(e.target.value);
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    if (koReg.test(pastedText) && langs[0] !== "ko")
      setLangs(["ko", "en", "ja"]);
    if (jaReg.test(pastedText) && langs[0] !== "ja")
      setLangs(["ja", "en", "ko"]);
    if (enReg.test(pastedText) && langs[0] !== "en")
      setLangs(["en", "ko", "ja"]);
  };

  useEffect(() => {
    if (initialWords) {
      const lastChar = initialWords.slice(-1);
      if (koReg.test(lastChar)) setLangs(["ko", "en", "ja"]);
      else if (jaReg.test(lastChar)) setLangs(["ja", "en", "ko"]);
      else if (enReg.test(lastChar)) setLangs(["en", "ko", "ja"]);
    }
  }, [initialWords]);

  useEffect(() => {
    document.getElementById("form")?.focus();
  }, [form]);

  return (
    <div className={classes.container}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button disabled />
        <Typography variant="h2" className={classes.title}>
          {form ? title : title2}
          <Button onClick={() => setForm((p) => !p)} sx={{ height: "100%" }}>
            <ArrowForwardIcon fontSize="large" />
          </Button>
        </Typography>
      </Box>

      <Box className={classes.langs}>
        <Typography variant="h5" fontWeight={"bold"}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => handleShuffle(0)}
          >
            {langNames[langs[0] as keyof typeof langNames]}
          </Button>
          <Button
            onClick={handleSwap}
            size="large"
            onMouseEnter={() => setChangeIcon(true)}
            onMouseLeave={() => setChangeIcon(false)}
          >
            {changedIcon ? <SwapHoriz /> : <TrendingFlatIcon />}
          </Button>
          <Button
            onClick={() => handleShuffle(1)}
            size="large"
            variant="outlined"
          >
            {langNames[langs[1] as keyof typeof langNames]}
          </Button>
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box className={classes.scroll}>
          <TextField
            id="form"
            fullWidth
            autoFocus={!smallScreen}
            label={form ? inputLabel : ""}
            placeholder={form ? placeholder : placeholder2}
            variant="outlined"
            color="primary"
            multiline
            value={text}
            rows={7}
            onChange={handleTextChange}
            onPaste={handlePaste}
            className={classes.textfield}
          />
        </Box>
        {form ? (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={loading}
            sx={{
              width: "100%",
              fontWeight: "bold",
            }}
          >
            {loading ? translating : translate}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={!text}
            sx={{
              width: "100%",
              fontWeight: "bold",
            }}
          >
            {convert}
          </Button>
        )}
      </form>
    </div>
  );
};

export default TranslationForm;
