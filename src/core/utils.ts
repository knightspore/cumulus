import type { Did, RecordKey } from "@atcute/lexicons";
import { formatDistance } from "date-fns";
import { Lexicon } from "./constants";

export function lmsr(q1: number, q2: number, b: number) {
    return 1 / (1 + Math.exp((q2 - q1) / b))
}

export function readableDateDiff(date: string | Date) {
    return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export function createUri(did: Did, lex: string, rkey: RecordKey) {
    return `at://${did}/${lex}/${rkey}`;
}

export function isMarketCollection(collection: string) {
    return collection === Lexicon.MARKET;
}

export function isBetCollection(collection: string) {
    return collection === Lexicon.BET;
}

export function isResolutionCollection(collection: string) {
    return collection === Lexicon.RESOLUTION;
}
