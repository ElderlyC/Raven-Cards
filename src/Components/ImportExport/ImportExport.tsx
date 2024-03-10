import { useState, useEffect, useRef } from "react";
import { Deck } from "../../App";
import { TextField, InputLabel, Button } from "@mui/material";

// if (importedDeck.length === 0) window.alert("No new cards!");

type ImportExportProps = {
  onImport: (importedDeck: Deck) => void;
  deck: Deck;
};

const ImportExport: React.FC<ImportExportProps> = ({ deck, onImport }) => {
  const [code, setCode] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPass] = useState(true);
  const [importedDeck, setImportedDeck] = useState<Deck>([]);
  const importProcessed = useRef(false);

  const emptyVals = code === "" || password === "";
  const url = "https://ko-en-cards-server-default-rtdb.firebaseio.com/";

  const handlePort = (type: string) => {
    if (window.confirm(`Are you sure you want to ${type}?`)) {
      if (type === "Import") {
        importDeck();
      } else {
        uploadDeck();
      }
    }
  };

  const uploadDeck = async () => {
    try {
      const response = await fetch(url + code + password + ".json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deck),
      });

      if (response.ok) window.alert("Deck uploaded successfully to Firebase");
    } catch (error: any) {
      window.alert("Error sending data to Firebase:" + error.message);
    }
  };

  const importDeck = async () => {
    try {
      const response = await fetch(url + code + password + ".json");
      const data = await response.json();
      if (data) {
        setImportedDeck(
          data.filter((importedCard) => {
            return !deck.some(
              (deckCard) => deckCard.front === importedCard.front
            );
          })
        );
      } else {
        window.alert("There is no deck that matches those details.");
      }
    } catch (error: any) {
      console.error("Error retrieving data from Firebase:", error.message);
    }
  };

  useEffect(() => {
    if (!importProcessed.current && importedDeck.length > 0) {
      if (
        window.confirm(
          `There are ${importedDeck.length} new cards. Add to current deck?`
        )
      ) {
        onImport(importedDeck);
        window.alert(`New cards added to deck.`);
      }
      importProcessed.current = true;
    }
  }, [importedDeck, onImport]);

  return (
    <div>
      <h1>Import / Upload Cards</h1>
      <div>
        <div>
          <InputLabel>Deck Name</InputLabel>
          <TextField
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ sx: { textAlign: "center" } }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <InputLabel>Deck Password</InputLabel>
          <TextField
            sx={{ width: "223px" }}
            value={password}
            onChange={(e) => setPass(e.target.value)}
            inputProps={{ sx: { textAlign: "center" } }}
            type={showPassword ? "" : "password"}
          />
          <Button onClick={() => setShowPass((p) => !p)}>
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <Button
          disabled={emptyVals}
          variant="contained"
          onClick={() => handlePort("Import")}
        >
          Import
        </Button>
        <Button
          disabled={emptyVals}
          variant="outlined"
          onClick={() => handlePort("Upload")}
        >
          Upload
        </Button>
        <p>{importedDeck[0]?.front}</p>
      </div>
    </div>
  );
};

export default ImportExport;
