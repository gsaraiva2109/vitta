// frontend/vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ------------------------------------------
  // INÍCIO DA CONFIGURAÇÃO DO PROXY
  server: {
    proxy: {
      // Quando o frontend requisitar um caminho que começa com '/api'
      "/api": {
        target: "http://localhost:3000", // URL e porta do seu backend (Node/Express)
        changeOrigin: true, // Necessário para hosts virtuais
        // Você pode omitir o 'rewrite' neste caso, pois seu backend usa rotas como '/auth',
        // mas o cliente usa '/api/auth'. Vamos garantir que o proxy apenas encaminhe o caminho original:
        // rewrite: (path) => path.replace(/^\/api/, ''), // Esta linha é Opcional
      },
    },
  },
  // FIM DA CONFIGURAÇÃO DO PROXY
  // ------------------------------------------
});
