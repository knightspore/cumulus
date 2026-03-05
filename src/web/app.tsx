import { useCumulus } from "./providers/useCumulus";
import { Card, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { formatDistance } from "date-fns"
import { Spinner } from "./components/ui/spinner";

export default function App() {
    return <div className="p-4">
        <MarketList />
    </div>
}

function MarketList() {
    const { markets, loading } = useCumulus();
    if (loading) return <Spinner />
    return <>
        {markets?.map(m => (<Card key={m.question}>
            <CardHeader>
                <CardTitle>{m.question}</CardTitle>
                <CardDescription>Closes {formatDistance(new Date(m.closesAt), new Date(), { addSuffix: true })}</CardDescription>
            </CardHeader>
        </Card>))}
    </>
}
