import { useEffect, useState } from "react";
import "./App.css";
import TranslationPair from "./Components/Translation/TranslationPair";
import TranslationForm from "./Components/Translation/TranslationForm";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  interface Word {
    source: string;
    target: string;
  }

  const wordlistString = localStorage.getItem("wordlist");
  const [words, setWords] = useState(["", ""]);
  const [mode, setMode] = useState(["ko", "en"]);
  const [loading, setLoading] = useState(false);
  const [wordList, setWordlist] = useState<Word[]>(
    wordlistString ? JSON.parse(wordlistString) : []
  );

  const [imageLink, setImage] = useState("");
  const [counter, setCounter] = useState(0);

  // Update the URL to point to your server
  const API_URL = "http://localhost:3001/api/translate";

  const getTranslation = () => {
    setLoading(true);

    // Make a copy of the current words state
    const currentWords = [...words];

    // Check if the source word is not empty
    if (currentWords[0]) {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: mode[0],
          target: mode[1],
          text: currentWords[0],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);

          const splitWords = currentWords[0].split("\n");
          const splitTranslation =
            data.message.result.translatedText.split("\n");
          const newWordsTuples = splitWords.map((element, index) => [
            element,
            splitTranslation[index],
          ]);
          // Create an array of new word objects
          const newWordsArray = newWordsTuples.map(([word, trans]) => ({
            source: word?.trim(), // Trim to remove any leading or trailing spaces
            target: trans?.trim(),
          }));

          // Append the new word objects to the wordList state
          setWordlist((prevWordList) => [...prevWordList, ...newWordsArray]);

          // Clear the input field
          setWords(["", ""]);
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleSwap = () => {
    setWords(([a, b]) => [b, a]);
    setMode(([a, b]) => [b, a]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleRemovePair = (source: string) => {
    setWordlist((wordlist) =>
      wordlist.filter((element) => element.source !== source)
    );
  };

  const handleImageGenerate = (link: string) => {
    console.log(counter);
    setImage(link[counter]?.link);
    counter > 10 ? setCounter(0) : setCounter((p) => p + 1);
  };

  useEffect(() => {
    localStorage.setItem("wordlist", JSON.stringify(wordList));
  }, [wordList]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <TranslationForm />
          <Button variant="contained" color="primary">
            Hello World
          </Button>
          <Button variant="contained" color="secondary">
            secondary
          </Button>
          <div>
            <p>
              {mode[0]} to {mode[1]}
            </p>
            <button onClick={handleSwap}>Swap!</button>
            <form onSubmit={handleSubmit}>
              <textarea
                rows={5}
                cols={20}
                id="source"
                placeholder="enter words/phrases here, separated by line"
                value={words[0]}
                onChange={(e) => {
                  setWords(([a, b]) => [e.target.value, b]);
                  setCounter(0);
                }}
              />
              <button onClick={getTranslation}>
                {loading ? "Loading" : "Translate and Add!"}
              </button>
            </form>
          </div>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <ul>
              {wordList &&
                wordList.map((obj) => (
                  <TranslationPair
                    key={obj.source + Math.random() * 10000}
                    source={obj.source}
                    target={obj.target}
                    onDelete={handleRemovePair}
                    onGenerate={handleImageGenerate}
                  />
                ))}
            </ul>
          </div>
          {imageLink && (
            <img
              src={imageLink}
              alt="definition"
              style={{ maxHeight: 600, maxWidth: 600 }}
            />
          )}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
