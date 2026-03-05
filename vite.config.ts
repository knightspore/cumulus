import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import metadata from "./src/web/public/oauth-client-metadata.json"

const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = process.env.LOCAL ? 8080 : 12520;

const atProtoOAuthPlugin: Plugin = {
    name: "atproto-oauth-plugin",
    config: (_conf, { command }) => {
        if (command === "build" && !process.env.LOCAL) {
            process.env.VITE_OAUTH_CLIENT_ID = metadata.client_id;
            process.env.VITE_OAUTH_REDIRECT_URI = metadata.redirect_uris[0];
        } else {
            const redirectUri = `http://${SERVER_HOST}:${SERVER_PORT}${new URL(metadata.redirect_uris[0]!).pathname}`
            process.env.VITE_OAUTH_CLIENT_ID =
                `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&scope=${encodeURIComponent(metadata.scope)}`;
            process.env.VITE_OAUTH_REDIRECT_URI = redirectUri;
        }
        process.env.VITE_OAUTH_SCOPE = metadata.scope;

    }
}

export default defineConfig({
    server: {
        host: SERVER_HOST,
        port: SERVER_PORT,
        proxy: { "/api": `http://${SERVER_HOST}:${process.env.PORT}` }
    },
    root: path.resolve(__dirname, './src/web'),
    plugins: [
        atProtoOAuthPlugin,
        react(),
        tailwindcss(),
    ],
    build: {
        outDir: "../../dist",
        emptyOutDir: true,
    }
});
