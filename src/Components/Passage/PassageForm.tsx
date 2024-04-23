import { Typography, Button, Box, TextField } from "@mui/material";
import classes from "./PassageForm.module.css";

const PassageForm = () => {
  return (
    <div className={classes.container}>
      <Typography variant="h2">{"Passage Mode"}</Typography>
      <Box className={classes.langs}>
        <Typography variant="h5" fontWeight={"bold"}>
          <Button
            size="large"
            variant="outlined"
            //onClick={() => handleShuffle(0)}
          >
            {"lang1"}
          </Button>
          <Button
            //onClick={handleSwap}
            size="large"
            // onMouseEnter={() => setChangeIcon(true)}
            // onMouseLeave={() => setChangeIcon(false)}
          >
            {"icon"}
          </Button>
          <Button
            //onClick={() => handleShuffle(1)}
            size="large"
            variant="outlined"
          >
            {"lang2"}
          </Button>
        </Typography>
      </Box>

      <form
      //onSubmit={handleSubmit}
      >
        <Box className={classes.scroll}>
          <TextField
            fullWidth
            //autoFocus={!smallScreen}
            //label={inputLabel}
            // placeholder={placeholder}
            variant="outlined"
            color="primary"
            multiline
            //value={text}
            rows={7}
            // onChange={handleTextChange}
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
