import { useState } from "react";
import type { Market } from "@/web/providers/cumulus-provider"
import { createBet } from "@/core/atproto-api";
import type { ResourceUri } from "@atcute/lexicons";
import { toast } from "sonner";
import { useAuth } from "@/web/hooks/useAuth";
import { ChartContainer } from "@/web/components/ui/chart";
import { Line, LineChart, Tooltip } from "recharts";
import { Button } from "@/web/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { parseMarket } from "@/core/markets";
import { ResolveMarket } from "./resolve-market";
import { readableDateDiff } from "@/core/utils";

type Props = {
    market: ReturnType<typeof parseMarket>,
}

export default function Market({ market }: Props) {

    const { profile, client } = useAuth()
    const [loading, setLoading] = useState<string | boolean>(false);
    const userOwnsMarket = profile.did === market.did;
    const queryClient = useQueryClient();

    async function handleBuy(position: "yes" | "no") {
        try {
            setLoading(market.cid)
            const res = await createBet({ uri: market.uri as ResourceUri, cid: market.cid }, position, profile.did, client)
            if (res.uri) toast.success(<>Placed {position.toUpperCase()} Bet <a target="_blank" href={`https://pdsls.dev/${res.uri}`}>{res.uri}</a> on market <a target="_blank" href={`https://pdsls.dev/${market.uri}`}>{market.uri}</a></>)
            queryClient.invalidateQueries({ queryKey: ['markets'] });
        } catch (e) {
            toast.error((e as any).message)
        } finally {
            setLoading(false);
        }
    }

    return <div
        key={market.cid}
        className="rounded-lg relative uppercase bg-radial-[at_80%_200%] from-coral-300 to-slate-300 via-coral-50"
    >

        <div className="absolute inset-0 p-2">
            <h2 className="text-xl font-bold flex gap-1 items-center">{market.question}</h2>
            <p>{market.isOpen ? "Closes" : "Closed"}: {readableDateDiff(market.closesAt)}</p>
            <p>Positions: {market.countBets}</p>
            {!market.isOpen && (market.isResolved
                ? <p>Resolution: <span className={market.resolution?.answer === "yes" ? "text-green-500" : "text-red-500"}>
                    {market.resolution?.answer.toUpperCase()}
                </span> ({market.priceYes} / {market.priceNo})</p>
                : <p>Resolution: PENDING ({market.priceYes} / {market.priceNo})</p>
            )}
        </div>

        <ChartContainer config={{ countYes: { label: "Yes" }, countNo: { label: "No" } }}>
            <LineChart data={market.bets}>
                <Tooltip />
                <Line
                    dataKey="countYes"
                    dot={false}
                    type="natural"
                    stroke={market.isOpen
                        ? "var(--color-shell-600)"
                        : market.resolution?.answer === "yes" ? "var(--color-green-500)" : "var(--color-shell-200)"}
                />
                <Line
                    dataKey="countNo"
                    dot={false}
                    type="natural"
                    stroke={market.isOpen
                        ? "var(--color-coral-600)"
                        : market.resolution?.answer === "no" ? "var(--color-red-500)" : "var(--color-coral-200)"}
                />
            </LineChart>
        </ChartContainer>

        {market.isOpen &&
            <div className="absolute bottom-0 right-0 p-1 flex gap-2">
                <Button size="sm" onClick={() => handleBuy("yes")} disabled={loading === market.cid}>
                    <CheckCircle2Icon /> YES {market.priceYes}
                </Button>
                <Button size="sm" onClick={() => handleBuy("no")} variant="secondary" disabled={loading === market.cid}>
                    <XCircleIcon />NO {market.priceNo}
                </Button>
            </div>}


        {userOwnsMarket && !market.resolution &&
            <div className="absolute top-0 right-0 p-1 flex gap-2">
                <ResolveMarket market={market} />
            </div>}
    </div >
}
