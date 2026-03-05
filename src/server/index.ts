import { Elysia } from "elysia"
import { staticPlugin } from '@elysiajs/static'

const app = new Elysia()
    .use(staticPlugin({ prefix: "/", assets: "dist" }))
    .get("/", () => new Response(Bun.file("dist/index.html")))
    .group("/api", (app) => (
        app.get("/db", () => "test")
    ))
    .listen({ port: process.env.PORT!, hostname: "0.0.0.0" })

console.log(`> Server running on ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`);
