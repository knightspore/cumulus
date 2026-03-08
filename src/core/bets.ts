import { lmsr } from "./utils";
import type { tryListMarkets } from "./api";

export function getPrices(yes: number, no: number, liquidity: number): { priceYes: string, priceNo: string } {
    return {
        priceYes: lmsr(yes, no, liquidity).toFixed(2),
        priceNo: lmsr(no, yes, liquidity).toFixed(2)
    }
}


export function parseBets(bets: Awaited<ReturnType<typeof tryListMarkets>>[number]['bets'], liquidity: number) {
    let [countYes, countNo] = [0, 0];
    return {
        countYes,
        countNo,
        countBets: bets.length,
        bets: bets
            ?.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
            .map(bet => {
                bet.position === "yes" ? countYes++ : countNo++;
                const { priceYes, priceNo } = getPrices(countYes, countNo, liquidity);
                const costPaid = bet.position === "yes" ? priceYes : priceNo;
                return { ...bet, countYes, countNo, positionPriceYes: priceYes, positionPriceNo: priceNo, costPaid }
            }),
        ...getPrices(countYes, countNo, liquidity),
    }
}
