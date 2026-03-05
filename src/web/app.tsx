import { useCumulus } from "./providers/useCumulus";
import { formatDistance } from "date-fns"
import { Spinner } from "./components/ui/spinner";
import { LineChart, Line, Tooltip } from "recharts";
import { ChartContainer } from "./components/ui/chart";
import { noPrice, yesPrice } from "./lib/lmsr";
import { Button } from "./components/ui/button";
import type { Market } from "./providers/cumulus-provider";
import { useState } from "react";
import { createBet } from "@/core";
import { useAuth } from "./providers/useAuth";
import type { ResourceUri } from "@atcute/lexicons";
import { toast } from "sonner";
import { queryClient } from "./main";

function parseMarket(market: Market) {
    let [yes, no] = [0, 0];

    const mappedBets = market.bets
        ?.sort((a, b) => a.createdAt > b.createdAt ? 1 : 0)
        .map(bet => {
            bet.position === "yes" ? yes++ : no++;
            return { ...bet, yes, no, }
        })

    const yesprice = yesPrice(yes, no, market.liquidity)
    const noprice = noPrice(yes, no, market.liquidity)
    const positions = market.bets?.length ?? 0;
    const closesAt = formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })

    return {
        yes, no, mappedBets, yesprice, noprice, positions, closesAt
    }
}

export default function App() {
    const { profile, client } = useAuth();
    const { markets } = useCumulus();

    const [loading, setLoading] = useState<string | boolean>(false);

    if (markets.isLoading) return <div className="p-4"><Spinner className='m-auto' /></div>

    return <div className="grid md:grid-cols-2 gap-2">
        {markets.data?.map(market => {

            const { yesprice, noprice, closesAt, mappedBets, positions } = parseMarket(market)

            async function handleBuy(position: "yes" | "no") {
                setLoading(market.cid)
                try {
                    const res = await createBet({
                        uri: market.uri as ResourceUri,
                        cid: market.cid,
                    }, position, profile.did, client)
                    if (res.uri) {
                        toast(<>Placed {position.toUpperCase()} Bet <a target="_blank" href={`https://pdsls.dev/${res.uri}`}>{res.uri.split("/")[res.uri.split("/").length - 1]}</a> at market: <a target="_blank" href={`https://pdsls.dev/${market.uri}`}>{market.rkey}</a></>)
                    }
                    queryClient.invalidateQueries({ queryKey: ['markets'] });
                } catch (e) {
                    toast(e as any)
                }
                setLoading(false);
            }

            return <div key={market.cid} className="relative uppercase bg-radial-[at_80%_200%] from-coral-500 via-coral-50">

                <div className="absolute inset-0 p-2">
                    <h2 className="text-xl font-bold flex gap-1 items-center">{market.question}</h2>
                    <p>Closes: {closesAt}</p>
                    <p>Positions: {positions}</p>
                </div>

                <ChartContainer
                    config={{ yes: { label: "Yes" }, no: { label: "No" } }}>
                    <LineChart data={mappedBets}>
                        <Tooltip />
                        <Line dataKey="yes" stroke="var(--color-shell-600)" />
                        <Line dataKey="no" stroke="var(--color-coral-600)" />
                    </LineChart>
                </ChartContainer>

                <div className="absolute bottom-0 right-0 p-2 flex gap-2">
                    <Button onClick={() => handleBuy("yes")} disabled={loading === market.cid}>YES {yesprice}</Button>
                    <Button onClick={() => handleBuy("no")} variant="secondary" disabled={loading === market.cid}>NO {noprice}</Button>
                </div>

            </div>
        })}
    </div>
}
