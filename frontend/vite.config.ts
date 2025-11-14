import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em desenvolvimento, redireciona /api para localhost:3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // Remover /api da URL antes de enviar para backend
        // Exemplo: /api/maquinas -> /maquinas
        // NÃO faça rewrite se o backend espera /api/maquinas
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

