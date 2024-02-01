import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TranslationForm from "./Components/Translation/TranslationForm";
import Wordlist from "./Components/Translation/Wordlist";
import AddFlashcard from "./Components/AddFlashcard/AddFlashcard";
import { WordPair } from "./types";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Typography } from "@mui/material";
import ReviewCards from "./Components/ReviewCards/ReviewCards";
import ViewDeck from "./Components/ViewDeck/ViewDeck";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export type Card = {
  front: string;
  back: string;
  created: string;
  nextReview: string;
  level: number;
  example: string;
  meaning: string;
};

export type Deck = Card[];

function App() {
  const wordlistString = localStorage.getItem("wordlist");
  const [wordList, setWordlist] = useState<WordPair[]>(
    wordlistString ? JSON.parse(wordlistString) : []
  );
  const [cardPair, setPair] = useState<WordPair>({ source: "", target: "" });
  const [meaning, setMeaning] = useState("");
  const [examples, setExamples] = useState<
    { text: string; translatedText: string }[]
  >([]);
  const [view, setView] = useState("home");

  const [initialDeck, setInitialDeck] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);

  const handleRemovePair = (source: string) => {
    setWordlist((wordlist) =>
      wordlist.filter((element) => element.source !== source)
    );
  };

  const handleAddToWordlist = (wordPair: WordPair) => {
    const sourceArray = wordPair.source
      .split("\n")
      .filter((word) => word !== "");
    const targetArray = wordPair.target
      .split("\n")
      .filter((word) => word !== "");
    const newWordsTuples = sourceArray.map((element, index) => [
      element,
      targetArray[index],
    ]);
    const newPairsArray = newWordsTuples.map(([source, target]) => ({
      source: source?.trim(),
      target: target?.trim(),
    }));
    setWordlist((prev) => [...newPairsArray, ...prev]);
  };

  const handleGenerateDefinition = async (searchWord: string) => {
    setMeaning("");
    setExamples([{ translatedText: "", text: "" }]);
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
    setView("newcard");
    handleGenerateDefinition(pair.source);
  };

  useEffect(() => {
    localStorage.setItem("wordlist", JSON.stringify(wordList));
  }, [wordList]);

  useEffect(() => {
    const localDeck = localStorage.getItem("deck");
    const parsedDeck = localDeck ? JSON.parse(localDeck) : [];
    setInitialDeck(parsedDeck);
  }, [view]);

  useEffect(() => {
    const now = new Date();
    setReviewCards(
      initialDeck.filter((card: Card) => new Date(card.nextReview) < now)
    );
  }, [initialDeck]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          {view === "home" ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <TranslationForm onTranslation={handleAddToWordlist} />
              <div style={{ margin: "20px" }}>
                <Wordlist
                  wordlist={wordList}
                  onRemovePair={handleRemovePair}
                  onAddCard={handleAddCard}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography // replace with material badge
                      sx={{
                        border: "lime 3px solid", // grey out when 0
                        borderRadius: "50%",
                        width: "30px",
                        fontWeight: "500",
                        color: "lime", // grey out when 0
                      }}
                    >
                      {reviewCards.length}
                    </Typography>
                  </div>
                  <Button
                    disabled={reviewCards.length === 0}
                    onClick={() => setView("review")}
                  >
                    Review!
                  </Button>

                  <Button onClick={() => setView("view")}>Browse Cards</Button>
                  <Button onClick={() => setView("")}>Settings</Button>
                </div>
              </div>
            </div>
          ) : view === "newcard" ? (
            <AddFlashcard
              pair={cardPair}
              meaning={meaning}
              examples={examples}
              onCardSubmit={() => setView("home")}
              deck={initialDeck}
              onSearchDef={handleGenerateDefinition}
              onRemovePair={handleRemovePair}
            />
          ) : view === "review" ? (
            <ReviewCards
              deck={initialDeck}
              reviewCards={reviewCards}
              onEndReview={() => setView("home")}
            />
          ) : view === "view" ? (
            <ViewDeck
              deck={initialDeck}
              onLeaveBrowser={() => setView("home")}
            />
          ) : (
            <div>view not set</div>
          )}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
