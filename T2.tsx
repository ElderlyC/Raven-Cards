const express = require("express");
const cors = require("cors");
const { Papago } = require("papago-translate");
const client = new Papago();
const nodeFetch = require("node-fetch-commonjs");

// import fetch from "node-fetch";
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));
// interface NaverApiResponseItem {
//   title: string;
//   link: string;
//   thumbnail: string;
//   sizeheight: string;
//   sizewidth: string;
// }

// interface NaverApiResponse {
//   lastBuildDate: string;
//   total: number;
//   start: number;
//   display: number;
//   items: NaverApiResponseItem[];
// }

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

// client
//   .define({
//     to: "ko",
//     text: "antisemitism",
//   })
//   .then((res) => console.log(res.result.items[0].pos[0].meanings[0]))
//   .catch(console.error);

// client
//   .translate({
//     from: "ko",
//     to: "en",
//     text: "취지",
//   })
//   .then((res) => console.log(res.result.translation));

app.get("/images", async (req, res) => {
  try {
    const { word } = req.query;
    console.log(word);
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

// fetch(`https://openapi.naver.com/v1/search/image?query=${"석가모니불"}+뜻`, {
//   headers: {
//     "X-Naver-Client-Id": "K36XW4vqHWjCWRFaXw9G",
//     "X-Naver-Client-Secret": "fblttEcVtD",
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data.items));

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
