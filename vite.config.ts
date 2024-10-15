import { readFileSync } from "fs";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [(await import("@vitejs/plugin-react-swc")).default()],

  server: {
    host: "127.0.0.1",
    port: 443,
    https: {
      key: readFileSync("../env/private_key.pem"),
      cert: readFileSync("../env/fullchain.pem"),
    },
  },
});
