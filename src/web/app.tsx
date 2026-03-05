import { useCumulus } from "./providers/useCumulus";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { formatDistance } from "date-fns"

export default function App() {
    return <div className="p-4 space-y-4">
        <h2>Markets</h2>
        <Markets />
    </div>
}

function Markets() {
    const { markets } = useCumulus();
    return <>
        {markets.data?.map(market => (<Card>
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
        ))}
    </>
}
