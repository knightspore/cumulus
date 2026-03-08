import type { Did } from "@atcute/lexicons";
import { getUnixTime } from "date-fns";
import { parseBets } from "./bets";
import type { tryListMarkets } from "./api";

export function parseMarket(market: Awaited<ReturnType<typeof tryListMarkets>>[number]) {
    return {
        ...market,
        ...parseBets(market.bets ?? [], market.liquidity),
        openForDays: (getUnixTime(market.closesAt) - getUnixTime(market.createdAt)) / 60 / 60 / 24,
        isOpen: new Date() < market.closesAt && market.resolution === null,
        isResolved: market.resolution !== null,
    }
}

export function calculateScoreAndRep(markets: Array<ReturnType<typeof parseMarket>>, did: Did) {
    let score = 0; // Profit and Loss
    let rep = 0; // Popularity of markets

    for (const market of markets) {
        const answer = market?.resolution?.answer;
        if (!answer) continue;
        for (const bet of market.bets ?? []) {
            if (market.did === did) rep++;
            if (bet.did === did) {
                if (bet.position === answer) score += (1.0 - parseFloat(bet.costPaid))
                else if (bet.position !== answer) score -= parseFloat(bet.costPaid)
            }
        }
    }

    return { score: score.toFixed(2), rep };
}
