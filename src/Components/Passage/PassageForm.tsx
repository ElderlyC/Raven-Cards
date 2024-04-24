import { useState } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import classes from "./PassageForm.module.css";

const PassageForm = ({ onConvert }) => {
  const [passage, setPassage] = useState("");
  const convertPassage = (event) => {
    event.preventDefault();
    //convert passage text into an array of words (remove punctuation)
    //for known words, compare to an array of 'known words', can click a word to make it known
    //unknown words highlighted in blue
    //card words in yellow
    console.log(passage);
    onConvert(passage);
    setPassage("");
  };
  return (
    <div className={classes.container}>
      <Typography variant="h2">{"Passage"}</Typography>
      <Box className={classes.langs}>
        <Typography variant="h5" fontWeight={"bold"}>
          <Button
            size="large"
            variant="outlined"
            //onClick={() => handleShuffle(0)}
          >
            {"Known"}
          </Button>
          <Button
            //onClick={handleSwap}
            size="large"
            variant="outlined"
            // onMouseEnter={() => setChangeIcon(true)}
            // onMouseLeave={() => setChangeIcon(false)}
          >
            {"Unknown"}
          </Button>
          <Button
            //onClick={() => handleShuffle(1)}
            size="large"
            variant="outlined"
          >
            {"Learning"}
          </Button>
        </Typography>
      </Box>

      <form onSubmit={convertPassage}>
        <Box className={classes.scroll}>
          <TextField
            fullWidth
            //autoFocus={!smallScreen}
            //label={inputLabel}
            placeholder={"Enter a passage to convert here"}
            variant="outlined"
            color="primary"
            multiline
            value={passage}
            rows={7}
            onChange={(e) => setPassage(e.target.value)}
            // onPaste={handlePaste}
            className={classes.textfield}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          //   disabled={loading}
          sx={{
            width: "100%",
            fontWeight: "bold",
          }}
        >
          {"Convert"}
        </Button>
      </form>
    </div>
  );
};

export default PassageForm;
