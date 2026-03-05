export function yesPrice(yes: number, no: number, liquidity: number) {
    return (1 / (1 + Math.exp((no - yes) / liquidity))).toFixed(2)
}

export function noPrice(yes: number, no: number, liquidity: number) {
    return (1 / (1 + Math.exp((yes - no) / liquidity))).toFixed(2)
}
