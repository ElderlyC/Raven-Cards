import { useState } from "react";
import { InputLabel, Switch, Typography } from "@mui/material";

// overlay mod (grey out background, close button, ok button, cancel, some settings to adjust)

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

      {/* <div>
        <div>
          <InputLabel>Maximum cards to review in a day:</InputLabel>
          <input type="number" min="1" max="300" defaultValue={30} />
          <TextField inputProps={{ sx: { textAlign: "center" } }} />
        </div>
      </div> */}
    </div>
  );
};

export default Settings;
