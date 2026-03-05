import { Elysia } from "elysia"
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema"
import { eq } from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

const app = new Elysia()
    .use(swagger())
    .use(staticPlugin({ prefix: "/", assets: "dist" }))
    .get("/", () => new Response(Bun.file("dist/index.html")))
    .group("/api", (app) => (
        app.get("/markets", async () =>
            Response.json(await db.query.marketsTable.findMany({
                with: { bets: true, resolution: true }
            }))
        ),
        app.get("/market/:uri", async ({ params: { uri } }) =>
            Response.json(await db.query.marketsTable.findFirst({
                where: eq(schema.marketsTable.uri, uri),
                with: { bets: true, resolution: true }
            }))
        ),
        app.get("/market/:uri/bets", async ({ params: { uri } }) =>
            Response.json(await db.query.betsTable.findMany({
                where: eq(schema.betsTable.marketUri, uri),
                with: {
                    market: { with: { resolution: true } }
                }
            }))
        ),
        app.get("/market/:uri/resolutions", async ({ params: { uri } }) =>
            Response.json(await db.query.resolutionsTable.findMany({
                where: eq(schema.resolutionsTable.marketUri, uri),
                with: {
                    market: { with: { bets: true } }
                }
            }))
        )
    ))
    .listen({ port: process.env.PORT!, hostname: "0.0.0.0" })

console.log(`> Server running on ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`);
