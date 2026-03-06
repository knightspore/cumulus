import { useCumulus } from "@/web/hooks/useCumulus";
import { Spinner } from "@/web/components/ui/spinner";
import Market from "@/web/components/market";
import { AddMarket } from "@/web/components/add-market";


export default function App() {
    const { markets } = useCumulus();

    if (markets.isLoading) return <div className="p-4"><Spinner className='m-auto' /></div>

    return <div className="grid p-2 md:grid-cols-2 gap-2">
        {markets.data?.map(market => <Market key={market.uri} market={market} />)}
        <AddMarket />
    </div>
}
