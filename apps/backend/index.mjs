import express from "express";
import cors from "cors";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { gzip } from "zlib";
import { promisify } from "util";

const gzipAsync = promisify(gzip);

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuração CORS
const corsOptions = {
  origin: [
    "http://localhost:5500", // Frontend Vite
    "http://127.0.0.1:5500", // Frontend Vite (alternativo)
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200, // Para compatibilidade com navegadores antigos
};

app.use(cors(corsOptions));

const getDataFromFile = async (size) => {
  try {
    const filePath = path.join(__dirname, "data", `${size}.json`);
    const fileData = await readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (err) {
    return { error: "File not found" };
  }
};

app.get("/data", async (req, res) => {
  const size = req.query.size;
  const format = req.query.format;
  const minify = req.query.minify === "1" || req.query.minify === "true";
  const useGzip = req.query.gzip === "1" || req.query.gzip === "true";

  const data = await getDataFromFile(size);

  if (format === "html") {
    res.render("posts", { users: data }, async (err, html) => {
      if (err) {
        return res.status(500).send("Error rendering template");
      }

      if (useGzip) {
        const compressed = await gzipAsync(Buffer.from(html, "utf-8"));
        res.set({
          "Content-Type": "text/html; charset=utf-8",
          "Content-Encoding": "gzip",
          "Content-Length": compressed.length,
        });
        res.send(compressed);
      } else {
        res.set("Content-Type", "text/html; charset=utf-8");
        res.send(html);
      }
    });
  } else if (format === "json") {
    const jsonString = minify
      ? JSON.stringify(data)
      : JSON.stringify(data, null, 2);

    if (useGzip) {
      const compressed = await gzipAsync(Buffer.from(jsonString, "utf-8"));
      res.set({
        "Content-Type": "application/json; charset=utf-8",
        "Content-Encoding": "gzip",
        "Content-Length": compressed.length,
      });
      res.send(compressed);
    } else {
      res.set("Content-Type", "application/json; charset=utf-8");
      res.send(jsonString);
    }
  } else {
    res.status(400).send("Invalid format");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
