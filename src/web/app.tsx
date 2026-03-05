import { useCumulus } from "./providers/useCumulus";
import { formatDistance, getUnixTime } from "date-fns"
import { Spinner } from "./components/ui/spinner";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "./components/ui/chart";
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
                    return {
                        ...bet,
                        createdAt: formatDistance(bet.createdAt, new Date(), { addSuffix: true }),
                        timestamp: getUnixTime(bet.createdAt),
                        yes,
                        no,
                        yesPrice: yesPrice(yes, no, market.liquidity),
                        testNoPrice: 1-yesPrice(yes,no,market.liquidity),
                        noPrice: noPrice(yes, no, market.liquidity),
                    }
                })


            return <div key={market.cid}>
                <h2>{market.question}</h2>
                <p>Closes {formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })}</p>
                <p>{market.bets?.length} Positions</p>
                <ChartContainer
                    className="border-2 rounded-lg"
                    config={{
                        yes: { label: "Yes" }, no: { label: "No" }
                    }}>
                    <LineChart data={mappedBets}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <ChartTooltip />
                        <XAxis dataKey="createdAt" interval={8} />
                        <Line dataKey="yes" stroke="var(--color-shell-600)" />
                        <Line dataKey="no" stroke="var(--color-coral-600)" />
                        <Line dataKey="yesPrice" stroke="var(--color-coral-600)" />
                        <Line dataKey="testNoPrice" stroke="var(--color-coral-600)" />
                        <Line dataKey="noPrice" stroke="var(--color-coral-600)" />
                    </LineChart>
                </ChartContainer>
            </div>
        })}
    </div>
}
