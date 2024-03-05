import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TranslationForm from "./Components/Translation/TranslationForm";
import Wordlist from "./Components/Translation/Wordlist";
import AddFlashcard from "./Components/AddFlashcard/AddFlashcard";
import { WordPair } from "./types";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Typography, Badge } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
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
  hint: string;
  image: [zoom: number, vertical: number, link: string];
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
  const [hanja, setHanja] = useState("");
  const [view, setView] = useState("home");
  const [hoursUntilNextReview, setNext] = useState([0, "hrs"]);

  const [initialDeck, setInitialDeck] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const emptyDeck = reviewCards.length === 0;

  const handleRemovePair = (source: string) => {
    setWordlist((wordlist) =>
      wordlist.filter((element) => element.source !== source)
    );
  };

  const handleAddToWordlist = (wordPair: WordPair) => {
    const sourceArray = wordPair.source
      .split("\n")
      .filter(
        (word) => word !== "" && !wordList.some((pair) => pair.source === word)
      );
    const targetArray = wordPair.target
      .split("\n")
      .filter(
        (word) => word !== "" && !wordList.some((pair) => pair.target === word)
      );
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
    setHanja("");
    setMeaning("");
    setExamples([{ translatedText: "", text: "" }]);
    const updatedToLang = /[a-zA-Z+]/.test(searchWord) ? "ko" : "en";
    try {
      const response = await axios.get<{
        meaning: string;
        examples: { text: string; translatedText: string }[];
        object: any;
        hanjaEntry: string;
      }>(
        "https://australia-southeast1-ko-en-cards.cloudfunctions.net/Ko-En-Cards",
        {
          params: { word: searchWord, to: updatedToLang },
        }
      );
      setMeaning(response.data.meaning);
      response.data.examples && setExamples(response.data.examples);
      setHanja(response.data.hanjaEntry);
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
    if (initialDeck.length > 0 && reviewCards.length === 0) {
      const timeSortedDeck: Deck = initialDeck.slice();
      timeSortedDeck.sort(
        (a: Card, b: Card) =>
          new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
      );
      const nextTime = new Date(timeSortedDeck[0].nextReview);
      const timeDifferenceSecs = (nextTime.getTime() - now.getTime()) / 1000;
      const timeDifferenceMins = timeDifferenceSecs / 60;
      setNext(
        timeDifferenceMins / 60 > 24
          ? [Math.ceil(timeDifferenceMins / 1440), "days"]
          : timeDifferenceMins > 90
          ? [Math.ceil(timeDifferenceMins / 60), "hrs"]
          : timeDifferenceMins < 1.5
          ? [timeDifferenceSecs.toFixed(), "secs"]
          : [timeDifferenceMins.toFixed(), "mins"]
      );
    }

    setReviewCards(
      initialDeck.filter((card: Card) => new Date(card.nextReview) < now)
    );
  }, [initialDeck, reviewCards.length]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          {view === "home" ? (
            <div className="home">
              <TranslationForm onTranslation={handleAddToWordlist} />

              <div className="wordlist-container">
                <Wordlist
                  wordlist={wordList}
                  onRemovePair={handleRemovePair}
                  onAddCard={handleAddCard}
                />
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      sx={{ fontWeight: "bold" }}
                      onClick={() => setView("view")}
                    >
                      Browse Deck
                    </Button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Badge
                      badgeContent={reviewCards.length}
                      color="success"
                      sx={{ width: "100%" }}
                    >
                      <Button
                        size="large"
                        disabled={emptyDeck}
                        onClick={() => setView("review")}
                        variant="contained"
                        fullWidth
                        sx={{
                          fontWeight: "bold",
                          paddingRight: "30px",
                        }}
                      >
                        <QuizIcon sx={{ marginRight: "10px" }} />
                        {(hoursUntilNextReview[0] as number) > 0
                          ? `in ~${hoursUntilNextReview[0]} ${hoursUntilNextReview[1]}`
                          : "Review!"}
                      </Button>
                    </Badge>
                  </div>
                  {/* <div>
                    <Button
                      size="large"
                      variant="contained"
                      sx={{ fontWeight: "bold", width: "170px" }}
                      onClick={() => setView("")}
                    >
                      Settings
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>
          ) : view === "newcard" ? (
            <AddFlashcard
              editMode={false}
              pair={cardPair}
              meaning={meaning}
              examples={examples}
              hanja={hanja}
              onEndEditing={() => setView("home")}
              deck={initialDeck}
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
              onRemovePair={handleRemovePair}
            />
          ) : (
            <div>
              <Typography variant="h3">View not set [WIP]</Typography>
              <Button onClick={() => setView("home")}>Go Back!</Button>
            </div>
          )}
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
