import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TranslationForm from "./Components/Translation/TranslationForm";
import Wordlist from "./Components/Translation/Wordlist";
import AddFlashcard from "./Components/AddFlashcard/AddFlashcard";
import { WordPair } from "./types";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Typography, Badge, useMediaQuery } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import ReviewCards from "./Components/ReviewCards/ReviewCards";
import ViewDeck from "./Components/ViewDeck/ViewDeck";
import ImportExport from "./Components/ImportExport/ImportExport";
import Settings from "./Components/Settings/Settings";
import { koReg, jaReg } from "./utilities";

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
  const smallScreen = useMediaQuery("(max-width:740px)");
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

  const [initialDeck, setInitialDeck] = useState<Deck>([]);
  const [reviewCards, setReviewCards] = useState<Deck>([]);
  const emptyDeck = reviewCards.length === 0;

  const storedOptions = JSON.parse(localStorage.getItem("options") || "{}");

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
    // if searchWord is 한글 (not hanja), translate to english, otherwise translate to korean
    const updatedToLang = koReg.test(searchWord) ? "en" : "ko";
    const isJapanese = jaReg.test(searchWord);

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
      console.log(response);
      if (isJapanese) {
        const firstItem = response.data.object.items[0];

        const jaData = firstItem?.pos[0]?.meanings[1]
          ? firstItem?.pos[0]?.meanings[1]
          : response.data.object.items[1]?.pos[0]?.meanings[1]; //2nd item when first missing

        /// ご飯 results in error (no meaning), 財布, こうはい＝nothing (where is the data?)
        setMeaning(jaData?.meaning);

        // set examples to object.examples[0] when not in meanings

        jaData.examples && setExamples(jaData.examples);
        setHanja(`${firstItem?.entry} ${firstItem?.subEntry}`); //kanji + furigana (non ordered) -test, order these (hiragana regex?)
      } else {
        setMeaning(response.data.meaning);
        response.data.examples && setExamples(response.data.examples);
        setHanja(response.data.hanjaEntry);
      }
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
              <TranslationForm
                onTranslation={handleAddToWordlist}
                smallScreen={smallScreen}
              />

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
                  <div style={{ flex: 1, width: "33%" }}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      sx={{
                        fontWeight: "bold",
                        padding: 0,
                        height: "42.25px",
                        lineHeight: "1rem",
                      }}
                      onClick={() => setView("view")}
                    >
                      Browse Deck
                    </Button>
                  </div>
                  <div style={{ flex: 1, width: "33%" }}>
                    <Button
                      size="large"
                      disabled={emptyDeck}
                      onClick={() => setView("review")}
                      variant="contained"
                      fullWidth
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      <QuizIcon
                        className="quiz"
                        sx={{
                          "@media (max-width: 740px)": {
                            margin: !emptyDeck ? "0 0 0 -10px" : "0 10px 0 5px",
                          },
                        }}
                      />
                      <span style={{ paddingRight: "5px" }}>
                        {(hoursUntilNextReview[0] as number) > 0
                          ? `${smallScreen ? "" : "in "}~${
                              hoursUntilNextReview[0]
                            } ${hoursUntilNextReview[1]}`
                          : "Review!"}
                      </span>
                      {!emptyDeck && (
                        <Badge
                          badgeContent={reviewCards.length}
                          color="success"
                          className="badge"
                          sx={{
                            "& .MuiBadge-badge": {
                              fontWeight: "bold",
                            },
                          }}
                        />
                      )}
                    </Button>
                  </div>
                  <div style={{ flex: 1, width: "33%" }}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      sx={{ fontWeight: "bold" }}
                      onClick={() => setView("settings")}
                    >
                      Settings
                    </Button>
                  </div>
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
              onImportExport={() => setView("import")}
              onRemovePair={handleRemovePair}
            />
          ) : view === "import" ? (
            <div>
              <ImportExport
                deck={initialDeck}
                onImport={(importedDeck) =>
                  setInitialDeck((deck: Deck) => [...deck, ...importedDeck])
                }
              />
              <Button variant="contained" onClick={() => setView("view")}>
                Done
              </Button>
            </div>
          ) : view === "settings" ? (
            <div>
              <Settings
                storedOptions={storedOptions}
                onSave={() => setView("home")}
              />
            </div>
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
