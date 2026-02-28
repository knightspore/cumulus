import { ZaCoCiaranCumulusMarket, type ZaCoCiaranCumulusBet, type ZaCoCiaranCumulusResolution } from "../../generated/typescript";

function createMarketRecord(
    { question, liquidity, closesAt }: ZaCoCiaranCumulusMarket.Main
): ZaCoCiaranCumulusMarket.Main {
    return {
        $type: "za.co.ciaran.cumulus.market",
        question,
        liquidity,
        closesAt,
        createdAt: new Date().toISOString()
    }

}

function createResolutionRecord(
    { market, answer }: ZaCoCiaranCumulusResolution.Main
): ZaCoCiaranCumulusResolution.Main {
    return {
        $type: "za.co.ciaran.cumulus.resolution",
        market,
        answer,
        createdAt: new Date().toISOString()
    }
}

function createBetRecord(
    { market, position }: ZaCoCiaranCumulusBet.Main
): ZaCoCiaranCumulusBet.Main {
    return {
        $type: "za.co.ciaran.cumulus.bet",
        market,
        position,
        createdAt: new Date().toISOString()
    }
}
