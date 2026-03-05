import { createContext, type PropsWithChildren } from "react";
import { ZaCoCiaranCumulusBet, ZaCoCiaranCumulusMarket, ZaCoCiaranCumulusResolution } from "../../../generated/typescript";
import { useAuth } from "./useAuth";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { listBets, listMarkets, listResolutions } from "../../core";
import { is } from "@atcute/lexicons";

export interface CumulusContext {
    markets: UseQueryResult<Array<ZaCoCiaranCumulusMarket.Main>>,
    bets: UseQueryResult<Array<ZaCoCiaranCumulusBet.Main>>,
    resolutions: UseQueryResult<Array<ZaCoCiaranCumulusResolution.Main>>
}

export const CumulusContext = createContext<CumulusContext | undefined>(undefined);

export default function Cumulus({ children }: PropsWithChildren) {

    const { profile, client } = useAuth();

    const markets = useQuery({
        queryKey: ['user', profile.did, 'markets'],
        queryFn: async () => (await listMarkets(profile.did, client))
            .records
            .map(r => r.value)
            .filter((v): v is ZaCoCiaranCumulusMarket.Main => is(ZaCoCiaranCumulusMarket.mainSchema, v))
    });

    const bets = useQuery({
        queryKey: ['user', profile.did, 'bets'],
        queryFn: async () => (await listBets(profile.did, client))
            .records
            .map(r => r.value)
            .filter((v): v is ZaCoCiaranCumulusBet.Main => is(ZaCoCiaranCumulusBet.mainSchema, v))
    });

    const resolutions = useQuery({
        queryKey: ['user', profile.did, 'resolutions'],
        queryFn: async () => (await listResolutions(profile.did, client))
            .records
            .map(r => r.value)
            .filter((v): v is ZaCoCiaranCumulusResolution.Main => is(ZaCoCiaranCumulusResolution.mainSchema, v))
    });

    const providerValue = { markets, bets, resolutions, }

    return <CumulusContext.Provider value={providerValue}>{children}</ CumulusContext.Provider>
}
