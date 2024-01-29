import React, { useState, useEffect, useRef, FormEvent } from "react";
import { WordPair } from "../../types";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

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
      }>("http://localhost:3002/translate", {
        source: langs[0],
        target: langs[1],
        text: text,
      });

      onTranslation({ source: text, target: response.data.translation });
    } catch (error) {
      console.error(error);
    }
    setText("");
  };

  const handleSwap = () => {
    setLangs(([lang1, lang2]) => [lang2, lang1]);
  };

  return (
    <div style={{ margin: "20px", minWidth: "40%", minHeight: "100%" }}>
      <Typography variant="h2">Translate</Typography>
      <Box sx={{ margin: "30px" }}>
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
            autoFocus
            label="Text to translate"
            placeholder="Enter words/phrases here, separated by line"
            variant="outlined"
            color="primary"
            multiline
            value={text}
            rows={7}
            onChange={(e) => setText(e.target.value)}
            sx={{
              width: "35vw",
            }}
            InputProps={{
              sx: {
                textarea: { fontSize: "2rem" },
                lineHeight: "3rem",
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          sx={{
            marginTop: "20px",
          }}
        >
          Translate
        </Button>
      </form>
    </div>
  );
};

export default TranslationForm;
