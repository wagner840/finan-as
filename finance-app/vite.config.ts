import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "myfinance.einsof7.com",
      "localhost",
      "127.0.0.1",
      ".einsof7.com", // Permite qualquer subdomínio de einsof7.com
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "myfinance.einsof7.com",
      "localhost",
      "127.0.0.1",
      ".einsof7.com",
    ],
  },
});
