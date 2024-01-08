const express = require("express");
const cors = require("cors");
const { Papago } = require("papago-translate");
const client = new Papago();

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
    const { text } = req.body;

    const result = await client.translate({
      from: "ko",
      to: "en",
      text: text,
    });

    res.status(200).json({ translation: result.result.translation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while translating the text." });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

client
  .define({
    to: "ko",
    text: "antisemitism",
  })
  .then((res) => console.log(res.result.items[0].pos[0].meanings[0]))
  .catch(console.error);
