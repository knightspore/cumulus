import { Elysia } from "elysia"
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { tryFindMarket, tryFindMarketBets, tryFindMarketResolutions, tryListMarkets } from "@/core/api";
import { ENV } from "@/core/env";

export const app = new Elysia()
    .use(cors())
    .use(swagger())
    .use(staticPlugin({ prefix: "/", assets: "dist" }))
    .get("/", () => new Response(Bun.file("dist/index.html")))
    .group("/api", api => api
        .get("/markets", async () => await tryListMarkets())
        .group("/market", (market) => market
            .get("/:uri", async ({ params }) => await tryFindMarket(params.uri))
            .get("/:uri/bets", async ({ params }) => await tryFindMarketBets(params.uri))
            .get("/:uri/resolutions", async ({ params }) => await tryFindMarketResolutions(params.uri))
        )
    ).listen({ port: ENV.PORT, hostname: "0.0.0.0" })

console.log(`> Server running on ${app.server?.protocol}://${app.server?.hostname}:${app.server?.port}`);
