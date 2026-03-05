import { useCumulus } from "./providers/useCumulus";
import { formatDistance } from "date-fns"
import { Spinner } from "./components/ui/spinner";
import { LineChart, Line, Tooltip } from "recharts";
import { ChartContainer } from "./components/ui/chart";
import { noPrice, yesPrice } from "./lib/lmsr";

export default function App() {
    const { markets } = useCumulus();

    if (markets.isLoading) return <Spinner className='m-auto' />

    return <div className="grid md:grid-cols-2 gap-2">
        {markets.data?.map(market => {
            let [yes, no] = [0, 0];
            let mappedBets = market.bets
                ?.sort((a, b) => a.createdAt > b.createdAt ? 1 : 0)
                .map(bet => {
                    if (bet.position === "yes") yes++;
                    if (bet.position === "no") no++;
                    return { ...bet, yes, no, }
                })
            return <div key={market.cid} className="relative uppercase bg-radial-[at_80%_200%] from-coral-500 via-coral-50">
                <div className="absolute inset-0 p-2">
                    <h2 className="text-xl font-bold flex gap-1 items-center">{market.question}</h2>
                    <p>Closes: {formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })}</p>
                    <p>Positions: {market.bets?.length}</p>
                    <p>Yes Price: {yesPrice(yes, no, market.liquidity)}</p>
                    <p>No Price: {noPrice(yes, no, market.liquidity)}</p>
                </div>
                <ChartContainer
                    config={{ yes: { label: "Yes" }, no: { label: "No" } }}>
                    <LineChart data={mappedBets}>
                        <Tooltip />
                        <Line dataKey="yes" stroke="var(--color-shell-600)" />
                        <Line dataKey="no" stroke="var(--color-coral-600)" />
                    </LineChart>
                </ChartContainer>
            </div>
        })}
    </div>
}
