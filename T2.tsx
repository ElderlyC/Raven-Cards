const express = require("express");
const cors = require("cors");
const { Papago } = require("papago-translate");
const client = new Papago();
const nodeFetch = require("node-fetch-commonjs");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  try {
    const { source, target, text } = req.body;

    const result = await client.translate({
      from: source,
      to: target,
      text: text,
    });

    res.status(200).json({
      translation: result.result.translation,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while translating the text." });
  }
});

app.get("/define", async (req, res) => {
  try {
    const { text, to } = req.query;
    const definition = await client.define({
      to: to,
      text: text,
    });
    res.status(200).json({
      meaning: definition.result?.items[0]?.pos[0]?.meanings[0]?.meaning,
      examples: definition.result?.items[0]?.pos[0]?.meanings[0]?.examples,
      object: definition.result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for a definition." });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/images", async (req, res) => {
  try {
    const { word } = req.query;
    const response = await nodeFetch(
      `https://openapi.naver.com/v1/search/image?query=${word}`,
      {
        headers: {
          "X-Naver-Client-Id": "K36XW4vqHWjCWRFaXw9G",
          "X-Naver-Client-Secret": "fblttEcVtD",
        },
      }
    );

    const data = await response.json();
    res.json(data.items);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
