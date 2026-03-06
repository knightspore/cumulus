import { parse } from "@atcute/lexicons";
import { it, expect } from "vitest";
import { ZaCoCiaranCumulusResolution } from "../../generated/typescript";
import * as CID from "@atcute/cid";
import * as TID from "@atcute/tid";
import { Lexicon } from "@/core/constants";
import { createUri } from "@/core/utils";

const tid = TID.now();
const cid = await CID.create(0x71, new Uint8Array([10]))

const data = {
    $type: Lexicon.RESOLUTION,
    market: {
        cid: CID.toString(cid),
        uri: createUri("did:plc:example", Lexicon.MARKET, tid),
    },
    answer: "yes",
    createdAt: "2026-02-25T11:52:33.278Z",
}

it("resolution schema validation", () => {
    const resolution = parse(ZaCoCiaranCumulusResolution.mainSchema, data);
    expect(resolution.$type).toEqual(Lexicon.RESOLUTION);
    expect(resolution.market).toEqual({
        cid: CID.toString(cid),
        uri: createUri("did:plc:example", Lexicon.MARKET, tid),
    });
    expect(resolution.answer).toEqual("yes");
    expect(resolution.createdAt).toEqual("2026-02-25T11:52:33.278Z");
});
