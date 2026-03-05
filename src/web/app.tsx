import { useCumulus } from "./providers/useCumulus";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { formatDistance } from "date-fns"
import type { Market } from "./providers/cumulus-provider";

export default function App() {
    const { markets } = useCumulus();
    return <div className="p-4 space-y-4">
        <h2>Markets</h2>
        {markets.data?.map(m => <Market key={m.cid} market={m} />)}
    </div>
}

function Market({ market }: { market: Market }) {
    return <Card>
        <CardHeader>
            <CardTitle>{market.question}</CardTitle>
            <CardDescription>Closes {formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Resolution: {market.resolution?.answer}</p>
        </CardContent>
        <CardFooter>
            <p>Bets: {market.bets?.length}</p>
        </CardFooter>
    </Card>
}
