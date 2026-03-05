import { useCumulus } from "./providers/useCumulus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { formatDistance } from "date-fns"
import { Spinner } from "./components/ui/spinner";

export default function App() {
    return <div className="p-4 space-y-4">
        <h2>Markets</h2>
        <Markets />
    </div>
}

function Markets() {

    const { markets } = useCumulus();
    
    if (markets.isLoading) {
        return <Card>
            <Spinner className='m-auto' />
        </Card>
    }

    return <>
        {markets.data?.map(market => (<Card key={market.cid}>
            <CardHeader>
                <CardTitle>{market.question}</CardTitle>
                <CardDescription>Closes {formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Resolution: {market.resolution?.answer.toUpperCase()}</p>
                <p>Bets: {market.bets?.length}</p>
            </CardContent>
        </Card>
        ))}
    </>
}
