import React, { useState, FormEvent } from "react";
import axios from "axios";

const TranslationForm: React.FC = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ translation: string }>(
        "http://localhost:3002/translate",
        {
          text: text,
        }
      );

      setTranslatedText(response.data.translation);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Text to translate:</label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Translate</button>
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
