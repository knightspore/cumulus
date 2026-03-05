import { useAuth } from "./providers/useAuth";
import { useCumulus } from "./providers/useCumulus";
import { Card, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { formatDistance } from "date-fns"
import { Spinner } from "./components/ui/spinner";

export default function App() {
    const { profile } = useAuth();
    return <main>
        <header className="bg-shell-100 p-2 h-10 flex justify-end gap-2 items-center">
            <img src={profile.avatar} className="h-6 rounded-full border-2" />
            <a href={`https://bsky.app/profile/${profile.handle}`} target="_blank">@{profile.handle}</a>
        </header>

        <div className="grid grid-cols-4">
            <div className="col-span-1 flex flex-col p-2 gap-2">
                <MarketList />
            </div>
        </div>
    </main>
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
