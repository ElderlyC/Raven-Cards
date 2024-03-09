import { useState } from "react";
import { Deck } from "../../App";
import { TextField, InputLabel, Button } from "@mui/material";

// compare importedDeck and current deck, there are x new cards, add them?

type ImportExportProps = {
  deck: Deck;
};

const ImportExport: React.FC<ImportExportProps> = ({ deck }) => {
  const [code, setCode] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPass] = useState(true);
  const [importedDeck, setImportedDeck] = useState<Deck>([]);
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
        method: "POST",
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
        window.alert("Deck imported successfully from Firebase");
        console.log("Deck retrieved successfully:", Object.values(data)[0]);
        setImportedDeck(Object.values(data)[0] as Deck);
        window.confirm(`There are ${"ten"} new cards`);
      } else {
        window.alert("There is no deck that match those details.");
      }
    } catch (error: any) {
      console.error("Error retrieving data from Firebase:", error.message);
    }
  };

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
