import { ChartLine } from "lucide-react";
import { DrawerTitle, Drawer, DrawerContent, DrawerHeader, DrawerTrigger, DrawerFooter } from "@/web/components/ui/drawer";
import { Button } from "@/web/components/ui/button";
import { Input } from "@/web/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/web/components/ui/select";
import { Spinner } from "@/web/components/ui/spinner";
import { useAuth } from "@/web/hooks/useAuth";
import { createMarket } from "@/core/atproto-api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AddMarket() {

    const { client, profile } = useAuth();
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [closesAt, setClosesAt] = useState<string | undefined>(undefined);
    const [liquidity, setLiquidity] = useState<10 | 50 | 200>(50);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    async function handleAddMarket() {
        try {
            setLoading(true);
            const res = await createMarket(question, liquidity, new Date(closesAt!).toISOString(), profile.did, client)
            if (res.uri) toast.success(<>Created Market <a target="_blank" href={`https://pdsls.dev/${res.uri}`}>{res.uri.split("/")[res.uri.split("/").length - 1]}</a></>)
            queryClient.invalidateQueries({ queryKey: ['markets'] });
            setOpen(false);
        } catch (e) {
            toast.error((e as any).message)
        } finally {
            setLoading(false);
        }
    }

    return <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
            <Button className="absolute bottom-8 right-8">
                + <ChartLine />
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Add a Question</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 px-4">
                <Input type="text" placeholder="...?" value={question} onChange={(e) => setQuestion(e.target.value)} />
                <Input type="date" placeholder="Closing Date" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
                <Select value={liquidity.toString()} onValueChange={(v) => setLiquidity(parseInt(v) as 10 | 50 | 200)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Liquidity" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">Small</SelectItem>
                        <SelectItem value="50">Medium</SelectItem>
                        <SelectItem value="200">Large</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DrawerFooter>
                <Button disabled={loading || !question || !closesAt} onClick={handleAddMarket}>{loading && <Spinner />} Add</Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}
