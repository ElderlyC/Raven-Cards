import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TranslationForm from "./Components/Translation/TranslationForm";
import Wordlist from "./Components/Translation/Wordlist";
import AddFlashcard from "./Components/AddFlashcard/AddFlashcard";
import { WordPair } from "./types";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Typography } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const wordlistString = localStorage.getItem("wordlist");
  //const [words, setWords] = useState(["", ""]);
  //const [loading, setLoading] = useState(false);
  const [wordList, setWordlist] = useState<WordPair[]>(
    wordlistString ? JSON.parse(wordlistString) : []
  );
  const [cardPair, setPair] = useState<WordPair>({ source: "", target: "" });
  const [meaning, setMeaning] = useState("");
  const [examples, setExamples] = useState<
    { text: string; translatedText: string }[]
  >([]);

  const [toLang, setToLang] = useState("en");

  //const [imageLink, setImage] = useState("");
  const [counter, setCounter] = useState(0);

  //setLoading(true);

  // Check if the source word is not empty
  //if (currentWords[0]) {

  const handleRemovePair = (source: string) => {
    setWordlist((wordlist) =>
      wordlist.filter((element) => element.source !== source)
    );
  };

  // const handleImageGenerate = (link: string) => {
  //   console.log(counter);
  //   setImage(link[counter]?.link);
  //   counter > 10 ? setCounter(0) : setCounter((p) => p + 1);
  // };

  const handleAddToWordlist = (wordPair: WordPair) => {
    const sourceArray = wordPair.source.split("\n");
    const targetArray = wordPair.target.split("\n");
    const newWordsTuples = sourceArray.map((element, index) => [
      element,
      targetArray[index],
    ]);
    const newPairsArray = newWordsTuples.map(([source, target]) => ({
      source: source?.trim(),
      target: target?.trim(),
    }));
    setWordlist((prev) => [...prev, ...newPairsArray]);
  };

  const handleGenerateDefinition = async (searchWord: string) => {
    setMeaning("");
    setExamples([{ translatedText: "", text: "" }]);
    /[a-zA-Z+]/.test(searchWord) ? setToLang("ko") : setToLang("en");
    const updatedToLang = /[a-zA-Z+]/.test(searchWord) ? "ko" : "en";
    try {
      const response = await axios.get<{
        meaning: string;
        examples: { text: string; translatedText: string }[];
      }>("http://localhost:3002/define", {
        params: { text: searchWord, to: updatedToLang },
      });
      setMeaning(response.data.meaning);
      response.data.examples && setExamples(response.data.examples);
    } catch (error) {
      console.error("Error fetching definition:", error);
    }
  };

  const handleAddCard = async (pair: WordPair) => {
    setPair(pair);
    handleGenerateDefinition(pair.source);
  };

  useEffect(() => {
    localStorage.setItem("wordlist", JSON.stringify(wordList));
  }, [wordList]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <TranslationForm onTranslation={handleAddToWordlist} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "45%",
            }}
          >
            <Wordlist
              wordlist={wordList}
              onRemovePair={handleRemovePair}
              onAddCard={handleAddCard}
            />
            <AddFlashcard
              pair={cardPair}
              meaning={meaning}
              examples={examples}
              onSearchDefinition={handleGenerateDefinition}
            />
          </div>

          {/* setCounter(0); */}

          {/* <TranslationPair
                    key={obj.source + Math.random() * 10000}
                    source={obj.source}
                    target={obj.target}
                    onDelete={handleRemovePair}
                    onGenerate={handleImageGenerate}
                  /> */}
          {/* {imageLink && (
            <img
              src={imageLink}
              alt="definition"
              style={{ maxHeight: 600, maxWidth: 600 }}
            />
          )} */}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
