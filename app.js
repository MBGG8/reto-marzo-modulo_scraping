const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const ejecutarScraping = require("./scraping");

dotenv.config();
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Página principal
app.get("/", (req, res) => {
  res.render("index", { productos: [], mensaje: "" });
});

// Ejecutar scraping
app.post("/scrape", async (req, res) => {
  const apiKey = req.body.apiKey;
  process.env.HUGGINGFACE_API_KEY = apiKey;

  try {
    await ejecutarScraping();
    const productos = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data", "productos.json"))
    );
    res.render("index", {
      productos,
      mensaje: "Scraping completado con éxito.",
    });
  } catch (error) {
    res.render("index", { productos: [], mensaje: "Error en el scraping." });
  }
});

// Descargar JSON
app.get("/download", (req, res) => {
  const file = path.join(__dirname, "data", "productos.json");
  res.download(file);
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
