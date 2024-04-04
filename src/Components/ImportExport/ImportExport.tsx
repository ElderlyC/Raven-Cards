import { useState, useEffect, useRef } from "react";
import { Deck } from "../../App";
import {
  TextField,
  InputLabel,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
} from "@mui/material";
import classes from "./ImportExport.module.css";

type ImportExportProps = {
  onSave: () => void;
  onImport: (importedDeck: Deck) => void;
  deck: Deck;
};

const ImportExport: React.FC<ImportExportProps> = ({
  onSave,
  deck,
  onImport,
}) => {
  const [code, setCode] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPass] = useState(false);
  const [importedDeck, setImportedDeck] = useState<Deck>([]);
  const importProcessed = useRef(false);
  const importAttempted = useRef(false);
  const [uploadedDecksArray, setUploaded] = useState(
    localStorage.getItem("uploadedDecks")
      ? JSON.parse(localStorage.getItem("uploadedDecks") as string)
      : []
  );

  const emptyVals = code === "" || password === "";
  const url = "https://ko-en-cards-server-default-rtdb.firebaseio.com/";

  const handlePort = (type: string) => {
    if (window.confirm(`Are you sure you want to ${type}?`)) {
      setCode("");
      setPass("");
      if (type === "Import") {
        importDeck();
      } else {
        uploadDeck();
      }
    }
  };

  const uploadDeck = async () => {
    const deckDetails = {
      cardNo: deck.length,
      deckName: code,
      password,
    };
    if (uploadedDecksArray.length === 0) {
      setUploaded([deckDetails]);
    } else {
      if (uploadedDecksArray.find((deck) => deck.deckName === code)) {
        if (uploadedDecksArray.find((deck) => deck.password === password)) {
          if (window.confirm("Overwrite current upload?")) {
            setUploaded((p) => [
              deckDetails,
              ...p.filter((deck) => deck.deckName !== code),
            ]);
          } else return;
        } else {
          window.alert("Incorrect Password!");
          return;
        }
      } else {
        setUploaded((p) => [deckDetails, ...p]);
      }
    }

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
        importAttempted.current = true;
      } else {
        window.alert("There is no deck that matches those details.");
      }
    } catch (error: any) {
      console.error("Error retrieving data from Firebase:", error.message);
    }
  };

  const deleteUpload = async (name, pass) => {
    if (!window.confirm("Are you sure you want to delete this deck?")) return;
    setUploaded((p) => p.filter((deck) => deck.deckName !== name));
    try {
      const response = await fetch(url + name + pass + ".json", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to delete deck");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  useEffect(() => {
    if (importAttempted.current && importedDeck.length === 0) {
      importAttempted.current = false;
      window.alert("No new cards!");
    }
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

  useEffect(() => {
    localStorage.setItem("uploadedDecks", JSON.stringify(uploadedDecksArray));
  }, [uploadedDecksArray]);

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
            margin: "10px",
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
          <Button variant="outlined" onClick={() => setShowPass((p) => !p)}>
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
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
        </div>
        <h2>Uploaded Decks</h2>
        <TableContainer className={classes.container}>
          <Table className={classes.table} stickyHeader>
            <TableHead className={classes.head}>
              <TableRow>
                <TableCell>Deck Name</TableCell>
                <TableCell>Card Number</TableCell>
                <TableCell>Password</TableCell>
                <TableCell width="80px"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.body}>
              {uploadedDecksArray.map((deck, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button onClick={() => setCode(deck.deckName)}>
                      {deck.deckName}
                    </Button>
                  </TableCell>
                  <TableCell>{deck.cardNo}</TableCell>
                  <TableCell>{"*".repeat(deck.password?.length)}</TableCell>
                  <TableCell className={classes.delete}>
                    <Button
                      color="error"
                      onClick={() => deleteUpload(deck.deckName, deck.password)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={onSave}>
          Done
        </Button>
      </div>
    </div>
  );
};

export default ImportExport;
