import { treaty } from "@elysiajs/eden"
import { createContext, type PropsWithChildren } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type CumulusServer } from "@/server/types";
import type { InferSelectModel } from "drizzle-orm";
import type { betsTable, marketsTable, resolutionsTable } from "@/db";
import { parseMarket } from "@/core/markets";


export type Market = InferSelectModel<typeof marketsTable> & {
    bets?: InferSelectModel<typeof betsTable>[],
    resolution?: InferSelectModel<typeof resolutionsTable>,
}

export interface CumulusContext {
    markets: UseQueryResult<Array<ReturnType<typeof parseMarket>>>,
}

export const CumulusContext = createContext<CumulusContext | undefined>(undefined);

export default function Cumulus({ children }: PropsWithChildren) {

    const server = treaty<CumulusServer>(window.location.origin);

    const markets = useQuery({
        queryKey: ['markets'],
        queryFn: async () => {
            const { data, error } = await server.api.markets.get()
            if (error) throw error;
            return (data as unknown as Market[]).map(m => parseMarket(m))
        },
    });

    return <CumulusContext.Provider value={{ markets }}>{children}</ CumulusContext.Provider>
}
