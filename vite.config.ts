import { defineConfig } from "vite"
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    server: {
        proxy: {
            "/api": "http://localhost:8080"
        }
    },
    root: path.resolve(__dirname, './src/web'),
    plugins: [react()],
    build: {
        outDir: "../../dist",
        emptyOutDir: true,
    }
});
