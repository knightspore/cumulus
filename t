[1mdiff --git a/src/server/index.ts b/src/server/index.ts[m
[1mindex b100294..8595011 100644[m
[1m--- a/src/server/index.ts[m
[1m+++ b/src/server/index.ts[m
[36m@@ -14,9 +14,10 @@[m [mexport const app = new Elysia()[m
     .use(staticPlugin({ prefix: "/", assets: "dist" }))[m
     .get("/", () => new Response(Bun.file("dist/index.html")))[m
     .group("/api", (app) => ([m
[31m-        app.get("/markets", async ({ params }) =>[m
[32m+[m[32m        app.get("/markets", async () =>[m
             Response.json(await db.query.marketsTable.findMany({[m
[31m-                with: { bets: true, resolution: true }[m
[32m+[m[32m                with: { bets: true, resolution: true },[m
[32m+[m[32m                orderBy: (markets, { desc }) => [desc(markets.createdAt)],[m
             }))[m
         ).group("/market", (app) => ([m
             app.get("/:uri", async ({ params: { uri } }) =>[m
[1mdiff --git a/src/web/app.tsx b/src/web/app.tsx[m
[1mindex 1fdd125..ff39ead 100644[m
[1m--- a/src/web/app.tsx[m
[1m+++ b/src/web/app.tsx[m
[36m@@ -25,30 +25,22 @@[m [mexport default function App() {[m
                         yes,[m
                         no,[m
                         yesPrice: yesPrice(yes, no, market.liquidity),[m
[31m-                        testNoPrice: 1-yesPrice(yes,no,market.liquidity),[m
                         noPrice: noPrice(yes, no, market.liquidity),[m
                     }[m
                 })[m
 [m
[31m-[m
[31m-            return <div key={market.cid}>[m
[31m-                <h2>{market.question}</h2>[m
[31m-                <p>Closes {formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })}</p>[m
[31m-                <p>{market.bets?.length} Positions</p>[m
[32m+[m[32m            return <div key={market.cid} className="space-y-2">[m
[32m+[m[32m                <h2 className="text-3xl font-medium">{market.question}</h2>[m
[32m+[m[32m                <p className="uppercase text-sm font-bold">Closes {formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })} | {market.bets?.length} Positions</p>[m
                 <ChartContainer[m
[31m-                    className="border-2 rounded-lg"[m
                     config={{[m
                         yes: { label: "Yes" }, no: { label: "No" }[m
                     }}>[m
                     <LineChart data={mappedBets}>[m
[31m-                        <CartesianGrid strokeDasharray="3 3" />[m
                         <ChartTooltip />[m
[31m-                        <XAxis dataKey="createdAt" interval={8} />[m
                         <Line dataKey="yes" stroke="var(--color-shell-600)" />[m
                         <Line dataKey="no" stroke="var(--color-coral-600)" />[m
[31m-                        <Line dataKey="yesPrice" stroke="var(--color-coral-600)" />[m
[31m-                        <Line dataKey="testNoPrice" stroke="var(--color-coral-600)" />[m
[31m-                        <Line dataKey="noPrice" stroke="var(--color-coral-600)" />[m
[32m+[m[32m                        <Line dataKey="yesPrice" />[m
                     </LineChart>[m
                 </ChartContainer>[m
             </div>[m
