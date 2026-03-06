import type { Did, RecordKey } from "@atcute/lexicons";
import { formatDistance } from "date-fns";
import { Lexicon } from "./constants";

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
