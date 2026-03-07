import type { Market } from "@/web/providers/cumulus-provider"
import { getUnixTime } from "date-fns";

function lsmr(q1: number, q2: number, b: number) {
    return 1 / (1 + Math.exp((q2 - q1) / b))
}

export function getPrices(yes: number, no: number, liquidity: number): [yesPrice: string, noPrice: string] {
    return [
        lsmr(yes, no, liquidity).toFixed(2),
        lsmr(no, yes, liquidity).toFixed(2)
    ]
}

export function parseMarket(market: Market) {
    let [countYes, countNo] = [0, 0];

    const bets = market.bets
        ?.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
        .map(bet => {
            bet.position === "yes" ? countYes++ : countNo++;
            const [currPriceYes, currPriceNo] = getPrices(countYes, countNo, market.liquidity);
            return { ...bet, countYes, countNo, currPriceYes, currPriceNo }
        });

    const [yesPrice, noPrice] = getPrices(countYes, countNo, market.liquidity);
    const positionCount = market.bets?.length ?? 0;
    const days = (getUnixTime(market.closesAt) - getUnixTime(market.createdAt)) / 60 / 60 / 24;
    const isMarketOpen = new Date() < market.closesAt;
    const canPlaceBets = isMarketOpen && (market.resolution === null)

    return { countYes, countNo, bets, yesPrice, noPrice, positionCount, days, isMarketOpen, canPlaceBets }
}
