import { useAuth } from "./providers/useAuth";
import { useCumulus } from "./providers/useCumulus";
import { formatDistance } from 'date-fns';

export default function App() {
    const { profile } = useAuth();
    return <main>
        <header className="bg-shell-100 p-2 h-10 flex justify-end gap-2 items-center">
            <img src={profile.avatar} className="h-6 rounded-full border-2" />
            <a href={`https://bsky.app/profile/${profile.handle}`} target="_blank">@{profile.handle}</a>
        </header>
        <Markets />
    </main>
}

function Markets() {
    const { markets, loading } = useCumulus();

    if (loading) return <p>Loading Markets...</p>

    return <>
        {markets?.map(m => <div key={m.createdAt} className="p-2">
            <p className="text-lg">{m.question}</p>
            <p>{formatDistance(new Date(m.createdAt), new Date(), { addSuffix: true })}</p>
        </div>
        )}
    </>
}
