import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin(["DATA_URL", "API_KEY"])],
  server: {
    hmr: {
      host: "localhost",
    },
    open: "/",
    port: 9000,
  },
});
