const express = require("express");
const fs = require("fs");
const path = require("path");
const ejecutarScraping = require("./scrapping_tottus");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { apiKey } = req.body;
  process.env.HUGGINGFACE_API_KEY = apiKey;

  try {
    await ejecutarScraping();
    const productos = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data", "productos.json"))
    );
    res.json({ success: true, productos });
  } catch {
    res.json({ success: false });
  }
});

// Descargar JSON
app.get("/download", (req, res) => {
  res.download(path.join(__dirname, "data", "productos.json"));
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
