import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    port: 5500,
    strictPort: true,
    cors: true,
  },
  // Servir assets do diretório pai como /assets
  publicDir: resolve(__dirname, "../../assets"),
  build: {
    // Para produção, gera arquivos estáticos sem transformações
    // que podem afetar performance
    rollupOptions: {
      input: {
        json: resolve(__dirname, "json.html"),
        html: resolve(__dirname, "html.html"),
        index: resolve(__dirname, "index.html"),
      },
    },
    // Não minificar em produção para manter baseline do experimento
    minify: false,
    // Copiar assets para build
    copyPublicDir: true,
  },
  // Não aplicar transformações que possam afetar performance
  esbuild: {
    // Manter código como está
  },
});
