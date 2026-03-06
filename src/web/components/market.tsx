import { useMemo, useState } from "react";
import { parseMarket } from "../lib/utils"
import type { Market } from "../providers/cumulus-provider"
import { createBet } from "@/core";
import type { ResourceUri } from "@atcute/lexicons";
import { toast } from "sonner";
import { useAuth } from "../providers/useAuth";
import { ChartContainer } from "./ui/chart";
import { Line, LineChart, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    market: Market
}

export default function Market({ market }: Props) {

    const { profile, client } = useAuth()
    const [loading, setLoading] = useState<string | boolean>(false);
    const { yesprice, noprice, closesAt, mappedBets, positions } = useMemo(() => parseMarket(market), [market.did]);
    const queryClient = useQueryClient();

    async function handleBuy(position: "yes" | "no") {
        try {
            setLoading(market.cid)
            const res = await createBet({ uri: market.uri as ResourceUri, cid: market.cid }, position, profile.did, client)
            if (res.uri) toast(<>Placed {position.toUpperCase()} Bet <a target="_blank" href={`https://pdsls.dev/${res.uri}`}>{res.uri.split("/")[res.uri.split("/").length - 1]}</a> at market: <a target="_blank" href={`https://pdsls.dev/${market.uri}`}>{market.rkey}</a></>)
            queryClient.invalidateQueries({ queryKey: ['markets'] });
        } catch (e) {
            toast(e as any)
        } finally {
            setLoading(false);
        }
    }

    return <div key={market.cid} className="relative uppercase bg-radial-[at_80%_200%] from-coral-500 via-coral-50">

        <div className="absolute inset-0 p-2">
            <h2 className="text-xl font-bold flex gap-1 items-center">{market.question}</h2>
            <p>Closes: {closesAt}</p>
            <p>Positions: {positions}</p>
        </div>

        <ChartContainer config={{ yes: { label: "Yes" }, no: { label: "No" } }}>
            <LineChart data={mappedBets}>
                <Tooltip />
                <Line
                    dataKey="yes" stroke="var(--color-shell-600)" />
                <Line dataKey="no" stroke="var(--color-coral-600)" />
            </LineChart>
        </ChartContainer>

        <div className="absolute bottom-0 right-0 p-2 flex gap-2">
            <Button onClick={() => handleBuy("yes")} disabled={loading === market.cid}>YES {yesprice}</Button>
            <Button onClick={() => handleBuy("no")} variant="secondary" disabled={loading === market.cid}>NO {noprice}</Button>
        </div>

    </div>
}
