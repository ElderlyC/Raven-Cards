import { useState } from "react";
import "./App.css";

function App() {
  interface Word {
    source: string;
    target: string;
  }

  const [words, setWords] = useState(["", ""]);
  const [mode, setMode] = useState(["en", "ko"]);
  const [loading, setLoading] = useState(false);
  const [wordList, setWordlist] = useState<Word[]>([]);
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

          // Create a new object representing the word and its translation
          const newWord = {
            source: currentWords[0],
            target: data.message.result.translatedText,
          };

          // Append the new word object to the wordList state
          setWordlist((prevWordList) => [...prevWordList, newWord]);

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

  const getImage = () => {
    if (counter > 10) setCounter(0);

    fetch(`http://localhost:3001/api/searchImage?query=${words[0]}`)
      .then((response) => response.json())
      .then((data) => {
        setImage(data.items[counter]?.link);
        setCounter((p) => p + 1);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p> */}
        <p>
          {mode[0]} to {mode[1]}
        </p>
        <button onClick={handleSwap}>Swap!</button>
        <form onSubmit={handleSubmit}>
          <input
            id="source"
            placeholder="enter a word here"
            value={words[0]}
            onChange={(e) => {
              setWords(([a, b]) => [e.target.value, b]);
              setCounter(0);
            }}
          />
          <button onClick={getTranslation}>
            {loading ? "Loading" : "Translate and Add!"}
          </button>
          <button onClick={getImage}>
            {counter === 0 ? "Get Image Defintion" : "Generate New Definition"}
          </button>
        </form>

        <ul>
          {wordList &&
            wordList.map((obj) => (
              <li key={obj.source}>
                {obj.source} {obj.target}
              </li>
            ))}
        </ul>
        <img src={imageLink} alt="defintion" style={{ maxHeight: 400 }} />
      </header>
    </div>
  );
}

export default App;
