const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const URL_BASE =
  "https://tottus.falabella.com.pe/tottus-pe/category/cat13380487/Despensa";

async function hacerScroll(page) {
  let alturaAnterior = 0;
  while (true) {
    alturaAnterior = await page.evaluate(async () => {
      window.scrollBy(0, window.innerHeight);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return document.body.scrollHeight;
    });

    let nuevaAltura = await page.evaluate(() => document.body.scrollHeight);
    if (nuevaAltura === alturaAnterior) break;
  }
}

async function extraerProductos(page) {
  try {
    await page.waitForSelector(".pod.pod-2_GRID.pod-link", { timeout: 5000 });
  } catch {
    return [];
  }

  return page.$$eval(".pod.pod-2_GRID.pod-link", (productos) =>
    productos.map((el) => ({
      nombre: el.querySelector(".pod-subTitle")?.innerText || "Sin nombre",
      marca: el.querySelector(".pod-title")?.innerText || "Sin marca",
      precio: el.querySelector(".prices-0 span")?.innerText || "Sin precio",
      imagen:
        el.querySelector("picture img")?.getAttribute("src") ||
        el.querySelector("picture img")?.getAttribute("data-src") ||
        "Sin imagen",
      enlace: el.href
        ? `https://tottus.falabella.com.pe${el.getAttribute("href")}`
        : "Sin enlace",
    }))
  );
}

async function analizarEmpaque(imagenUrl) {
  if (!imagenUrl.includes("http")) return "No aplica";
  try {
    const buffer = await axios.get(imagenUrl, { responseType: "arraybuffer" });
    const respuesta = await axios.post(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      buffer.data,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        timeout: 4000,
      }
    );

    const flexible = respuesta.data.some((r) =>
      ["plastic", "bag", "package", "wrap", "film", "pouch"].some((w) =>
        r.label.toLowerCase().includes(w)
      )
    );

    return flexible ? "Sí" : "No";
  } catch {
    return "Error";
  }
}

async function ejecutarScraping() {
  const navegador = await puppeteer.launch({ headless: "new" });
  const pagina = await navegador.newPage();
  let paginaActual = 1;
  let listaProductos = [];

  while (true) {
    const url = `${URL_BASE}?page=${paginaActual}`;
    console.log(`🔍 Cargando página: ${url}`);
    await pagina.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    await hacerScroll(pagina);
    const productosExtraidos = await extraerProductos(pagina);

    if (!productosExtraidos.length) break;

    for (let producto of productosExtraidos) {
      producto.flexible = await analizarEmpaque(producto.imagen);
      listaProductos.push(producto);
    }

    paginaActual++;
  }

  await navegador.close();
  fs.writeFileSync(
    path.join(__dirname, "data", "productos.json"),
    JSON.stringify(listaProductos, null, 2)
  );
}

module.exports = ejecutarScraping;
