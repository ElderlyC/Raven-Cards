import React, { useState, FormEvent } from "react";
import { WordPair } from "../../types";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import classes from "./TranslationForm.module.css";

type TranslationFormTypes = {
  onTranslation: ({ source, target }: WordPair) => void;
  smallScreen: boolean;
};

const TranslationForm: React.FC<TranslationFormTypes> = ({
  onTranslation,
  smallScreen,
}) => {
  const [text, setText] = useState("");
  const [langs, setLangs] = useState(["ko", "en", "ja"]);
  const [loading, setLoading] = useState(false);

  const langNames = { ko: "Korean", en: "English", ja: "Japanese" };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
    setLoading(true);
    try {
      const response = await axios.post<{
        translation: string;
        meaning: string;
      }>(
        "https://australia-southeast1-ko-en-cards.cloudfunctions.net/Ko-En-Cards",
        { source: langs[0], target: langs[1], text: text }
      );

      onTranslation({ source: text, target: response.data.translation });
    } catch (error) {
      console.error(error);
    }
    setText("");
    setLoading(false);
  };

  const handleShuffle = (index: number) => {
    if (index === 0) setLangs(([lang1, lang2, lang3]) => [lang3, lang2, lang1]);
    else setLangs(([lang1, lang2, lang3]) => [lang1, lang3, lang2]);
  };

  const handleSwap = () => {
    setLangs(([lang1, lang2, lang3]) => [lang2, lang1, lang3]);
  };

  const handleTextChange = (e) => {
    const lastChar = e.target.value.slice(-1);
    const koReg = /[\u3131-\uD79D]/giu; // regex for Korean 한글
    const jaReg = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/gu; // regex for Japanese characters
    if (koReg.test(lastChar) && langs[0] !== "ko") setLangs(["ko", "en", "ja"]);
    if (jaReg.test(lastChar) && langs[0] !== "ja") setLangs(["ja", "en", "ko"]);
    if (/[a-zA-Z+]/.test(lastChar) && langs[0] !== "en")
      setLangs(["en", "ko", "ja"]);
    setText(e.target.value);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h2">Translate</Typography>
      <Box className={classes.langs}>
        <Typography variant="h5" fontWeight={"bold"}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => handleShuffle(0)}
          >
            {langNames[langs[0] as keyof typeof langNames]}
          </Button>
          <Button onClick={handleSwap} size="large">
            {"<  to  >"}
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
        <Box>
          <TextField
            fullWidth
            autoFocus={!smallScreen}
            label="Text to translate"
            placeholder="Enter words/phrases here, separated by line"
            variant="outlined"
            color="primary"
            multiline
            value={text}
            rows={7}
            onChange={handleTextChange}
            className={classes.textfield}
          />
        </Box>
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
          {loading ? "Translating..." : "Translate"}
        </Button>
      </form>
    </div>
  );
};

export default TranslationForm;
