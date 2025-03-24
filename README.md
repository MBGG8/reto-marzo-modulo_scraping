# Scraping de Productos desde Tottus

Este proyecto utiliza **Puppeteer** para realizar un web scraping de productos de la tienda online de Tottus en Falabella, extrayendo información como nombre, marca, precio, imagen, enlace, y analizando si el empaque es flexible (como plástico, bolsa, etc.) mediante un modelo de Hugging Face.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes requisitos:

- **Node.js**: Es necesario tener Node.js instalado. Puedes descargarlo desde [aquí](https://nodejs.org/).
- **NPM** (Node Package Manager): Viene incluido con Node.js.

Además, necesitarás una **API Key de Hugging Face** para utilizar el modelo de análisis de empaques. Puedes obtenerla creando una cuenta en [Hugging Face](https://huggingface.co/) y generando un token de API en tu perfil.

## Instalación

1. **Clonar el repositorio**:

   Si aún no tienes el proyecto, clónalo desde GitHub:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <CARPETA_DEL_PROYECTO>
   ```

## Ejecución

Una vez que hayas configurado el proyecto y todo esté listo, sigue estos pasos para ejecutar el script de scraping y obtener los datos extraídos en un archivo JSON.

### 1. Ejecutar el script de scraping

Para iniciar el proceso de scraping, abre tu terminal en la carpeta del proyecto y ejecuta el siguiente comando:

```bash
node index.js
```


![image](https://github.com/user-attachments/assets/5161c204-8b9e-4f2b-b5b3-f535a78aadde)

