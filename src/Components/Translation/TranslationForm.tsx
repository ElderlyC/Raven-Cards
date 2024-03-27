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
  const [langs, setLangs] = useState(["ko", "en"]);
  const [loading, setLoading] = useState(false);

  const langNames = { ko: "Korean", en: "English" };

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
