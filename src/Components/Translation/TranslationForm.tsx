import React, { useState, FormEvent } from "react";
import { WordPair } from "../../types";
import { TextField, Button } from "@mui/material";
import axios from "axios";

type TranslationFormTypes = {
  onTranslation: ({ source, target }: WordPair) => void;
};

const TranslationForm: React.FC<TranslationFormTypes> = ({ onTranslation }) => {
  const [text, setText] = useState("");
  const [langs, setLangs] = useState(["ko", "en"]);

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
      <div>
        <p>
          {langs[0]} to {langs[1]}
        </p>
        <button onClick={handleSwap}>Swap!</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Text to translate"
            placeholder="Enter words/phrases here, separated by line"
            variant="outlined"
            color="primary"
            multiline
            value={text}
            minRows={3}
            maxRows={5}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Translate
        </Button>
      </form>
    </div>
  );
};

export default TranslationForm;
