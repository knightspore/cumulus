import { useMemo, useState } from "react";
import type { Market } from "../providers/cumulus-provider"
import { createBet } from "@/core";
import type { ResourceUri } from "@atcute/lexicons";
import { toast } from "sonner";
import { useAuth } from "../providers/useAuth";
import { ChartContainer } from "./ui/chart";
import { Line, LineChart, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { parseMarket } from "@/core/markets";
import { readableDateDiff } from "@/core/utils";

type Props = {
    market: Market
}

export default function Market({ market }: Props) {

    const { profile, client } = useAuth()
    const [loading, setLoading] = useState<string | boolean>(false);
    const { yesPrice, noPrice, bets, positionCount } = useMemo(() => parseMarket(market), [market]);
    const queryClient = useQueryClient();

    async function handleBuy(position: "yes" | "no") {
        try {
            setLoading(market.cid)
            const res = await createBet({ uri: market.uri as ResourceUri, cid: market.cid }, position, profile.did, client)
            if (res.uri) toast.success(<>Placed {position.toUpperCase()} Bet <a target="_blank" href={`https://pdsls.dev/${res.uri}`}>{res.uri.split("/")[res.uri.split("/").length - 1]}</a> at market: <a target="_blank" href={`https://pdsls.dev/${market.uri}`}>{market.rkey}</a></>)
            queryClient.invalidateQueries({ queryKey: ['markets'] });
        } catch (e) {
            toast.error((e as any).message)
        } finally {
            setLoading(false);
        }
    }

    return <div key={market.cid} className="rounded-lg relative uppercase bg-radial-[at_80%_200%] from-coral-500 bg-slate-300 via-coral-50">

        <div className="absolute inset-0 p-2">
            <h2 className="text-xl font-bold flex gap-1 items-center">{market.question}</h2>
            <p>Closes: {readableDateDiff(market.createdAt)}</p>
            <p>Positions: {positionCount}</p>
        </div>

        <ChartContainer config={{ countYes: { label: "Yes" }, countNo: { label: "No" } }}>
            <LineChart data={bets}>
                <Tooltip />
                <Line dataKey="countYes" stroke="var(--color-shell-600)" />
                <Line dataKey="countNo" stroke="var(--color-coral-600)" />
            </LineChart>
        </ChartContainer>

        <div className="absolute bottom-0 right-0 p-1 flex gap-2">
            <Button size="sm" onClick={() => handleBuy("yes")} disabled={loading === market.cid}>
                <CheckCircle2Icon /> YES {yesPrice}
            </Button>
            <Button size="sm" onClick={() => handleBuy("no")} variant="secondary" disabled={loading === market.cid}>
                <XCircleIcon />NO {noPrice}
            </Button>
        </div>

    </div>
}
