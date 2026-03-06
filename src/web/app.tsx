import { useCumulus } from "./providers/useCumulus";
import { Spinner } from "./components/ui/spinner";
import Market from "./components/market";
import { AddMarket } from "./components/add-market";


export default function App() {
    const { markets } = useCumulus();

    if (markets.isLoading) return <div className="p-4"><Spinner className='m-auto' /></div>

    return <div className="grid md:grid-cols-2 divide-shell-900 divide-y-2">
        {markets.data?.map(market => <Market key={market.uri} market={market} />)}
        <AddMarket />
    </div>
}
