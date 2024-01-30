const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/api/translate", async (req, res) => {
  const { source, target, text } = req.body;
  try {
    const response = await fetch("https://openapi.naver.com/v1/papago/n2mt", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Naver-Client-Id": "YzwucLf4jOAfMmSpZH7y",
        "X-Naver-Client-Secret": "AlPVX1gjZH",
      },
      body: new URLSearchParams({
        source,
        target,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/searchImage", async (req, res) => {
  const { query } = req.query;

  try {
    const response = await fetch(
      // `https://openapi.naver.com/v1/search/image?query=${query}+뜻`,
      `https://openapi.naver.com/v1/search/image?query=${query}`,
      {
        headers: {
          "X-Naver-Client-Id": "K36XW4vqHWjCWRFaXw9G",
          "X-Naver-Client-Secret": "fblttEcVtD",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

fetch(`https://openapi.naver.com/v1/search/image?query=${"석가모니불"}+뜻`, {
  headers: {
    "X-Naver-Client-Id": "K36XW4vqHWjCWRFaXw9G",
    "X-Naver-Client-Secret": "fblttEcVtD",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data.items));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
