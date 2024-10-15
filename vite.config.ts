import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), viteBasicSslPlugin()],
  server: {
    host: "127.0.0.1",
    port: 443,
  },
});
