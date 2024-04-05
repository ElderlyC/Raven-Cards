import { useState, useEffect } from "react";
import { InputLabel, Switch, Typography, Button } from "@mui/material";
import { pageContent } from "./SettingsText";

// review intervals/frequency
// dictionary links (use other dictionaries than naver)
// auto upload to firebase after review?
// settings text, swap TAB and SHIFT ENTER onClick?

const Settings = ({ storedOptions, onSave }) => {
  const [displayLang, setLang] = useState(storedOptions.language || "English");
  const [oddLevelFlip, setOddFlip] = useState(
    storedOptions.oddLevelFlip || false
  );
  const languages: string[] = ["English", "Korean", "Japanese"];
  const {
    title,
    displayLabel,
    langButtonLabel,
    oddLabel,
    switchOff,
    switchSwap,
    shortcuts,
    hint,
    skip,
    save,
  } = pageContent[displayLang];

  const handleOddLevel = (event) => {
    const { checked } = event.target;
    setOddFlip(checked);
  };

  const changeLang = () => {
    const currentIndex = languages.findIndex((lang) => lang === displayLang);
    setLang(languages[(currentIndex + 1) % languages.length]);
  };

  useEffect(() => {
    localStorage.setItem(
      "options",
      JSON.stringify({
        oddLevelFlip: oddLevelFlip,
        language: displayLang,
      })
    );
  }, [oddLevelFlip, displayLang]);

  return (
    <div>
      <h1>{title}</h1>
      <div style={{ margin: "20px" }}>
        <InputLabel>{displayLabel}</InputLabel>
        <div>
          <Button variant="outlined" onClick={changeLang}>
            {langButtonLabel}
          </Button>
        </div>
      </div>
      <div>
        <InputLabel>{oddLabel}</InputLabel>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography margin="0 10px 0 15px">{switchOff}</Typography>
          <Switch checked={oddLevelFlip} onChange={(e) => handleOddLevel(e)} />
          <Typography marginLeft="10px">{switchSwap}</Typography>
        </div>
      </div>
      <div style={{ margin: "20px" }}>
        <InputLabel>{shortcuts}</InputLabel>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>{hint}</Typography>
          <Button>Tab</Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>{skip}</Typography>
          <Button>Shift+Enter</Button>
        </div>
      </div>
      <Button variant="contained" onClick={onSave}>
        {save}
      </Button>
    </div>
  );
};

export default Settings;
