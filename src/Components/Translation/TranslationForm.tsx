import React, { useState, FormEvent } from "react";
import { WordPair } from "../../types";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import classes from "./TranslationForm.module.css";

// handle japanese translation

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
        // { source: langs[0], target: langs[1], text: text } // testing japanese
        { source: "auto", target: "en", text: text } // testing japanese
      );

      onTranslation({ source: text, target: response.data.translation });
    } catch (error) {
      console.error(error);
    }
    setText("");
    setLoading(false);
  };

  const handleShuffle = () => {
    setLangs(([lang1, lang2, lang3]) => [lang3, lang1, lang2]);
  };

  const handleSwap = () => {
    setLangs(([lang1, lang2, lang3]) => [lang2, lang1, lang3]);
  };

  const handleTextChange = (e) => {
    const koReg = /[\u3131-\uD79D]/giu; // regex for korean 한글
    if (
      (/[a-zA-Z+]/.test(text.slice(-1)) && langs[0] === "ko") ||
      (koReg.test(text.slice(-1)) && langs[0] === "en")
    )
      handleSwap(); // this code is now broken
    setText(e.target.value);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h2">Translate</Typography>
      <Box className={classes.langs}>
        <Typography variant="h5" fontWeight={"bold"}>
          {langNames[langs[0] as keyof typeof langNames]}
          <Button onClick={handleSwap} size="large">
            {"<  to  >"}
          </Button>
          {langNames[langs[1] as keyof typeof langNames]}
        </Typography>
        <Typography variant="h5" fontWeight={"bold"}>
          <Button onClick={handleShuffle} size="large">
            {langNames[langs[0] as keyof typeof langNames]}
          </Button>
          <Button onClick={handleSwap} size="large">
            {"<  to  >"}
          </Button>
          <Button onClick={handleShuffle} size="large">
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
