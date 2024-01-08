import React from "react";
// overlay mod (grey out background, close button, ok button, cancel, some settings to adjust)
const Settings = () => {
  return (
    <div>
      Settings
      <div>
        <label>Maximum cards to review in a day: </label>{" "}
        <input type="number" min="1" max="300" defaultValue={30} />
      </div>
    </div>
  );
};

export default Settings;
