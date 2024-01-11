import React, { useState, FormEvent } from "react";
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
    <div>
      <Box sx={{ margin: "30px" }}>
        <Typography variant="h4">
          {langNames[langs[0] as keyof typeof langNames]} to{" "}
          {langNames[langs[1] as keyof typeof langNames]}
        </Typography>
        <Button onClick={handleSwap} size="large">
          Swap!
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            label="Text to translate"
            placeholder="Enter words/phrases here, separated by line"
            variant="outlined"
            color="primary"
            multiline
            value={text}
            rows={5}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              sx: { textarea: { fontSize: "1.5rem" }, lineHeight: "2rem" },
            }}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" size="large">
          Translate
        </Button>
      </form>
    </div>
  );
};

export default TranslationForm;
