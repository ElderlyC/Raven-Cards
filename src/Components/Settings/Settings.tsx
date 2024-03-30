import { useState } from "react";
import { InputLabel, Switch, Typography } from "@mui/material";

// review intervals/frequency

const Settings = () => {
  const storedOptions = JSON.parse(localStorage.getItem("options") || "{}");
  const [oddLevelFlip, setOddFlip] = useState(
    storedOptions.oddLevelFlip || false
  );

  const handleOddLevel = (event) => {
    const { checked } = event.target;
    setOddFlip(checked);
    localStorage.setItem("options", JSON.stringify({ oddLevelFlip: checked }));
  };

  return (
    <div>
      <h1>Settings</h1>
      <InputLabel>Swap question and answer on odd card levels</InputLabel>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography margin="0 10px 0 15px">Off</Typography>
        <Switch checked={oddLevelFlip} onChange={(e) => handleOddLevel(e)} />
        <Typography marginLeft="10px">Swap</Typography>
      </div>
    </div>
  );
};

export default Settings;
