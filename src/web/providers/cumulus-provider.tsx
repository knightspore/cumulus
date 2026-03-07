import { treaty } from "@elysiajs/eden"
import { createContext, useMemo, type PropsWithChildren } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { type CumulusServer } from "@/server/types";
import type { InferSelectModel } from "drizzle-orm";
import type { betsTable, marketsTable, resolutionsTable } from "@/db";
import { calculateScoreAndRep, parseMarket } from "@/core/markets";
import { useAuth } from "../hooks/useAuth";


export type Market = InferSelectModel<typeof marketsTable> & {
    bets?: InferSelectModel<typeof betsTable>[],
    resolution?: InferSelectModel<typeof resolutionsTable>,
}

export interface CumulusContext {
    markets: UseQueryResult<Array<ReturnType<typeof parseMarket>>>,
    score: number,
    rep: number,
}

export const CumulusContext = createContext<CumulusContext | undefined>(undefined);

export default function Cumulus({ children }: PropsWithChildren) {

    const { profile } = useAuth();
    const server = treaty<CumulusServer>(window.location.origin);

    const markets = useQuery({
        queryKey: ['markets'],
        queryFn: async () => {
            const { data, error } = await server.api.markets.get()
            if (error) throw error;
            return (data as unknown as Market[]).map(m => parseMarket(m))
        },
    });

    const { score, rep } = useMemo(() =>
        markets.data
            ? calculateScoreAndRep(markets.data, profile.did)
            : { score: 0, rep: 0 },
        [markets.data, profile.did]
    );

    return <CumulusContext.Provider value={{ markets, score, rep }}>
        {children}
    </ CumulusContext.Provider>
}
