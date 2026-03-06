import { treaty } from "@elysiajs/eden"
import { createContext, type PropsWithChildren } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type CumulusServer } from "@/server/types";
import type { InferSelectModel } from "drizzle-orm";
import * as schema from "../../db/schema"


export type Market = InferSelectModel<typeof schema.marketsTable> & {
    bets?: InferSelectModel<typeof schema.betsTable>[],
    resolution?: InferSelectModel<typeof schema.resolutionsTable>,
}

export interface CumulusContext {
    markets: UseQueryResult<Market[]>,
}

export const CumulusContext = createContext<CumulusContext | undefined>(undefined);

export default function Cumulus({ children }: PropsWithChildren) {

    const server = treaty<CumulusServer>(window.location.origin);

    const markets = useQuery({
        queryKey: ['markets'],
        queryFn: async () => {
            const { data, error } = await server.api.markets.get()
            if (error) throw error;
            return data as unknown as Market[];
        },
    });

    return <CumulusContext.Provider value={{ markets }}>{children}</ CumulusContext.Provider>
}
