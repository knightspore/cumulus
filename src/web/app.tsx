import { useCumulus } from "./providers/useCumulus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { formatDistance } from "date-fns"
import { Spinner } from "./components/ui/spinner";

export default function App() {
    return <div className="p-4 space-y-4">
        <BetList />
        <MarketList />
        <ResolutionList />
    </div>
}

function BetList() {
    const { bets } = useCumulus();
    return <Card>
        <CardHeader>
            <CardTitle>Bets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {bets.isLoading ? <Spinner /> : bets.data?.map(b => (<Card key={b.market.uri}>
                <CardHeader>
                    <CardTitle>{b.position}</CardTitle>
                    <CardDescription>Created {formatDistance(new Date(b.createdAt), new Date(), { addSuffix: true })}</CardDescription>
                </CardHeader>
            </Card>))}
        </CardContent>
    </Card>
}

function MarketList() {
    const { markets } = useCumulus();
    return <Card>
        <CardHeader>
            <CardTitle>Markets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {markets.isLoading ? <Spinner /> : markets.data?.map(m => (<Card key={m.question}>
                <CardHeader>
                    <CardTitle>{m.question}</CardTitle>
                    <CardDescription>Closes {formatDistance(new Date(m.closesAt), new Date(), { addSuffix: true })}</CardDescription>
                </CardHeader>
            </Card>))}
        </CardContent>
    </Card>
}

function ResolutionList() {
    const { resolutions } = useCumulus();
    return <Card>
        <CardHeader>
            <CardTitle>Resolutions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {resolutions.isLoading ? <Spinner /> : resolutions.data?.map(r => (<Card key={r.market.cid}>
                <CardHeader>
                    <CardTitle>{r.answer}</CardTitle>
                    <CardDescription>Resolved {formatDistance(new Date(r.createdAt), new Date(), { addSuffix: true })}</CardDescription>
                </CardHeader>
            </Card>))}
        </CardContent>
    </Card>
}
