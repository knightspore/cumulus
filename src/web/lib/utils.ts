import { formatDistance } from "date-fns"
import { noPrice, yesPrice } from "../lib/lmsr";
import type { Market } from "../providers/cumulus-provider";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function parseMarket(market: Market) {
    let [yes, no] = [0, 0];

    const mappedBets = market.bets
        ?.sort((a, b) => a.createdAt > b.createdAt ? 1 : 0)
        .map(bet => {
            bet.position === "yes" ? yes++ : no++;
            return { ...bet, yes, no, }
        })

    const yesprice = yesPrice(yes, no, market.liquidity)
    const noprice = noPrice(yes, no, market.liquidity)
    const positions = market.bets?.length ?? 0;
    const closesAt = formatDistance(new Date(market.closesAt), new Date(), { addSuffix: true })

    return {
        yes, no, mappedBets, yesprice, noprice, positions, closesAt
    }
}
