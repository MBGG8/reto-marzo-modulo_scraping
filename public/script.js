document
  .getElementById("scrapingForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const apiKey = document.getElementById("apiKey").value;
    const mensaje = document.getElementById("mensaje");
    mensaje.innerText = "⏳ Ejecutando scraping...";

    const response = await fetch("/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    });

    const data = await response.json();

    if (data.success) {
      mensaje.innerText = "✅ Scraping completado con éxito.";
      mostrarResultados(data.productos);
      document.getElementById("descargarBtn").style.display = "block";
    } else {
      mensaje.innerText = "Scraping terminado.";
    }
  });

function mostrarResultados(productos) {
  const tbody = document.querySelector("#resultados tbody");
  tbody.innerHTML = "";

  productos.forEach((producto) => {
    const row = `
            <tr>
                <td><img src="${producto.imagen}" alt="Imagen"></td>
                <td>${producto.nombre}</td>
                <td>${producto.marca}</td>
                <td>${producto.precio}</td>
                <td>${producto.flexible}</td>
                <td><a href="${producto.enlace}" target="_blank">Ver</a></td>
            </tr>
        `;
    tbody.innerHTML += row;
  });
}

// Descargar JSON
document.getElementById("descargarBtn").addEventListener("click", () => {
  window.location.href = "/download";
});
