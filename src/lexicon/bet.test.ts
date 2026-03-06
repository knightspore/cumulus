import { parse } from "@atcute/lexicons";
import { it, expect } from "vitest";
import { ZaCoCiaranCumulusBet } from "../../generated/typescript";
import * as CID from "@atcute/cid";
import * as TID from "@atcute/tid";
import { Lexicon } from "@/core/constants";
import { createUri } from "@/core/utils";

const tid = TID.now();
const cid = await CID.create(0x71, new Uint8Array([20]))

const data = {
    $type: Lexicon.BET,
    market: {
        cid: CID.toString(cid),
        uri: createUri("did:plc:example", Lexicon.BET, tid),
    },
    position: "no",
    createdAt: "2026-02-25T11:52:33.278Z",
}

it("bet schema validation", () => {
    const bet = parse(ZaCoCiaranCumulusBet.mainSchema, data);
    expect(bet.$type).toEqual(Lexicon.BET);
    expect(bet.market).toEqual({
        cid: CID.toString(cid),
        uri: createUri("did:plc:example", Lexicon.BET, tid),
    });
    expect(bet.position).toEqual("no");
    expect(bet.createdAt).toEqual("2026-02-25T11:52:33.278Z");
});
