import React, { useState, FormEvent } from "react";
import { WordPair } from "../../types";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import classes from "./TranslationForm.module.css";

type TranslationFormTypes = {
  onTranslation: ({ source, target }: WordPair) => void;
};

const TranslationForm: React.FC<TranslationFormTypes> = ({ onTranslation }) => {
  const [text, setText] = useState("");
  const [langs, setLangs] = useState(["ko", "en"]);

  const langNames = { ko: "Korean", en: "English" };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
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
  };

  const handleSwap = () => {
    setLangs(([lang1, lang2]) => [lang2, lang1]);
  };

  const handleTextChange = (e) => {
    const koReg = /[\u3131-\uD79D]/giu; // regex for korean 한글
    if (
      (/[a-zA-Z+]/.test(text.slice(-1)) && langs[0] === "ko") ||
      (koReg.test(text.slice(-1)) && langs[0] === "en")
    )
      handleSwap();
    setText(e.target.value);
  };

  return (
    <div
      className={classes.container}
      style={{
        minWidth: "30%",
        minHeight: "100%",
        flex: 1,
        maxWidth: "600px",
      }}
    >
      <Typography variant="h2">Translate</Typography>
      <Box className={classes.langs}>
        <Typography variant="h5" fontWeight={"bold"}>
          {langNames[langs[0] as keyof typeof langNames]}
          <Button onClick={handleSwap} size="large">
            {"<  to  >"}
          </Button>
          {langNames[langs[1] as keyof typeof langNames]}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            fullWidth
            autoFocus
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
          sx={{
            width: "100%",
            fontWeight: "bold",
          }}
        >
          Translate
        </Button>
      </form>
    </div>
  );
};

export default TranslationForm;
