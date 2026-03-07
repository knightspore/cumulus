import type { Market } from "@/web/providers/cumulus-provider"
import type { Did } from "@atcute/lexicons";
import { getUnixTime } from "date-fns";

function lsmr(q1: number, q2: number, b: number) {
    return 1 / (1 + Math.exp((q2 - q1) / b))
}

export function getPrices(yes: number, no: number, liquidity: number): { priceYes: string, priceNo: string } {
    return {
        priceYes: lsmr(yes, no, liquidity).toFixed(2),
        priceNo: lsmr(no, yes, liquidity).toFixed(2)
    }
}

export function parseMarket(market: Market) {
    let [countYes, countNo] = [0, 0];

    const bets = market.bets
        ?.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
        .map(bet => {
            bet.position === "yes" ? countYes++ : countNo++;
            const { priceYes, priceNo } = getPrices(countYes, countNo, market.liquidity);
            const costPaid = bet.position === "yes" ? priceYes : priceNo;
            return { ...bet, countYes, countNo, positionPriceYes: priceYes, positionPriceNo: priceNo, costPaid }
        });

    return {
        ...market,
        ...getPrices(countYes, countNo, market.liquidity),
        countYes,
        countNo,
        bets,
        countBets: market.bets?.length ?? 0,
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
