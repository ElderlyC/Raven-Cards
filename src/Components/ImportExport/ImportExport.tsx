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
import { pageContent } from "./ImportExportText";

// export update date (date is part of json, displays last time u sent to firebase)

type ImportExportProps = {
  displayLang: string;
  onSave: () => void;
  onImport: (importedDeck: Deck) => void;
  deck: Deck;
};

const ImportExport: React.FC<ImportExportProps> = ({
  displayLang,
  onSave,
  deck,
  onImport,
}) => {
  const textContent = pageContent[displayLang];
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
    if (
      window.confirm(
        type === "Import" ? textContent.checkImport : textContent.checkExport
      )
    ) {
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
          if (window.confirm(textContent.overwrite)) {
            setUploaded((p) => [
              deckDetails,
              ...p.filter((deck) => deck.deckName !== code),
            ]);
          } else return;
        } else {
          window.alert(textContent.badPassword);
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

      if (response.ok) window.alert(textContent.uploadSuccess);
    } catch (error: any) {
      window.alert(textContent.errorSend + error.message);
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
        window.alert(textContent.badDetails);
      }
    } catch (error: any) {
      console.error(textContent.errorRetrieve, error.message);
    }
  };

  const deleteUpload = async (name, pass) => {
    if (!window.confirm(textContent.delDeck)) return;
    setUploaded((p) => p.filter((deck) => deck.deckName !== name));
    try {
      const response = await fetch(url + name + pass + ".json", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(textContent.delFail);
      }
    } catch (error) {
      console.error(textContent.delError, error);
    }
  };

  useEffect(() => {
    if (importAttempted.current && importedDeck.length === 0) {
      importAttempted.current = false;
      window.alert(textContent.noNew);
    }
    if (!importProcessed.current && importedDeck.length > 0) {
      if (
        window.confirm(
          `${textContent.newCards} ${importedDeck.length} ${textContent.newCards2}`
        )
      ) {
        onImport(importedDeck);
        window.alert(textContent.addedCards);
      }
      importProcessed.current = true;
    }
  }, [importedDeck, onImport, textContent]);

  useEffect(() => {
    localStorage.setItem("uploadedDecks", JSON.stringify(uploadedDecksArray));
  }, [uploadedDecksArray]);

  return (
    <div>
      <h1>{textContent.title}</h1>
      <div>
        <div>
          <InputLabel>{textContent.deckName}</InputLabel>
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
          <InputLabel>{textContent.deckPassword}</InputLabel>
          <TextField
            sx={{ width: "223px" }}
            value={password}
            onChange={(e) => setPass(e.target.value)}
            inputProps={{ sx: { textAlign: "center" } }}
            type={showPassword ? "" : "password"}
          />
          <Button variant="outlined" onClick={() => setShowPass((p) => !p)}>
            {showPassword ? textContent.hide : textContent.show}
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            disabled={emptyVals}
            variant="contained"
            onClick={() => handlePort("Import")}
          >
            {textContent.import}
          </Button>
          <Button
            disabled={emptyVals}
            variant="outlined"
            onClick={() => handlePort("Upload")}
          >
            {textContent.upload}
          </Button>
        </div>
        <h2>{textContent.uploadedDecks}</h2>
        <TableContainer className={classes.container}>
          <Table className={classes.table} stickyHeader>
            <TableHead className={classes.head}>
              <TableRow>
                <TableCell>{textContent.deckName}</TableCell>
                <TableCell>{textContent.cardNumber}</TableCell>
                <TableCell>{textContent.password}</TableCell>
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
                      {textContent.del}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={onSave}>
          {textContent.done}
        </Button>
      </div>
    </div>
  );
};

export default ImportExport;
