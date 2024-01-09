import React, { useState, FormEvent } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";

const TranslationForm: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [langs, setLangs] = useState(["ko", "en"]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ translation: string }>(
        "http://localhost:3002/translate",
        {
          source: langs[0],
          target: langs[1],
          text: text,
        }
      );

      setTranslatedText(response.data.translation);
    } catch (error) {
      console.error(error);
    }
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
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Translate
        </Button>
      </form>
      {translatedText && (
        <p>
          Translated text: <span>{translatedText}</span>
        </p>
      )}
    </div>
  );
};

export default TranslationForm;
