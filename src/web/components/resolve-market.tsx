import { useState } from "react";
import { DrawerTitle, Drawer, DrawerContent, DrawerHeader, DrawerTrigger, DrawerFooter } from "@/web/components/ui/drawer";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { CircleQuestionMark } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Spinner } from "./ui/spinner";
import { createResolution } from "@/core/atproto-api";
import type { ResourceUri } from "@atcute/lexicons";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { parseMarket } from "@/core/markets";

type Props = {
    market: ReturnType<typeof parseMarket>
}

export function ResolveMarket({ market }: Props) {

    const { client, profile } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resolution, setResolution] = useState<"yes" | "no">();
    const queryClient = useQueryClient();

    async function handleResolveMarket() {
        try {
            setLoading(true);
            const res = await createResolution({ uri: market.uri as ResourceUri, cid: market.cid }, resolution!, profile.did, client);
            if (res.uri) toast.success(<>Market Resolved <a target="_blank" href={`https://pdsls.dev/${res.uri}`}>{res.uri}</a></>)
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
            <Button size="sm" variant="link">
                <CircleQuestionMark /> Resolve Market
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Resolve Market {market.rkey}</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 px-4">
                <Select value={resolution} onValueChange={(v) => setResolution(v as "yes" | "no")}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Resolution" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="yes">YES</SelectItem>
                        <SelectItem value="no">NO</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DrawerFooter>
                <Button disabled={loading ?? resolution === undefined} onClick={handleResolveMarket}>{loading && <Spinner />} Resolve</Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}
