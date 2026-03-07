import { useMemo, useState } from "react";
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
import { readableDateDiff } from "@/core/utils";
import { ResolveMarket } from "./resolve-market";

type Props = {
    market: Market
}

export default function Market({ market }: Props) {

    const { profile, client } = useAuth()

    const [loading, setLoading] = useState<string | boolean>(false);

    const {
        yesPrice,
        noPrice,
        bets,
        positionCount,
        isMarketOpen,
        marketHasResolution,
        userOwnsMarket
    } = useMemo(() => parseMarket(market, profile), [market, profile]);

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
            <p>{isMarketOpen ? "Closes" : "Closed"}: {readableDateDiff(market.closesAt)}</p>
            <p>Positions: {positionCount}</p>
            {!isMarketOpen && (marketHasResolution
                ? <p>Resolution: <span className={market.resolution?.answer === "yes" ? "text-green-500" : "text-red-500"}>{market.resolution?.answer.toUpperCase()}</span></p>
                : <p>Resolution: PENDING</p>
            )}
        </div>

        <ChartContainer config={{ countYes: { label: "Yes" }, countNo: { label: "No" } }}>
            <LineChart data={bets}>
                <Tooltip />
                <Line
                    dataKey="countYes"
                    dot={false}
                    type="natural"
                    stroke={isMarketOpen
                        ? "var(--color-shell-600)"
                        : market.resolution?.answer === "yes" ? "var(--color-green-500)" : "var(--color-shell-200)"}
                />
                <Line
                    dataKey="countNo"
                    dot={false}
                    type="natural"
                    stroke={isMarketOpen
                        ? "var(--color-coral-600)"
                        : market.resolution?.answer === "no" ? "var(--color-red-500)" : "var(--color-coral-200)"}
                />
            </LineChart>
        </ChartContainer>

        {isMarketOpen &&
            <div className="absolute bottom-0 right-0 p-1 flex gap-2">
                <Button size="sm" onClick={() => handleBuy("yes")} disabled={loading === market.cid}>
                    <CheckCircle2Icon /> YES {yesPrice}
                </Button>
                <Button size="sm" onClick={() => handleBuy("no")} variant="secondary" disabled={loading === market.cid}>
                    <XCircleIcon />NO {noPrice}
                </Button>
            </div>
        }


        {userOwnsMarket && !market.resolution &&
            <div className="absolute top-0 right-0 p-1 flex gap-2">
                <ResolveMarket market={market} />
            </div>
        }
    </div >
}
