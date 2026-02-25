import { parse } from "@atcute/lexicons";
import { it, expect } from "vitest";
import { ZaCoCiaranCumulusResolution } from "../generated/typescript";
import * as CID from "@atcute/cid";
import * as TID from "@atcute/tid";

const tid = TID.now();
const cid = await CID.create(0x71, new Uint8Array([10]))

const data = {
    $type: "za.co.ciaran.cumulus.resolution",
    market: {
        cid: CID.toString(cid),
        uri: `at://did:plc:example/za.co.ciaran.cumulus.market/${tid}`
    },
    answer: "yes",
    createdAt: "2026-02-25T11:52:33.278Z",
}

it("market schema validation", () => {
    const resolution = parse(ZaCoCiaranCumulusResolution.mainSchema, data);
    expect(resolution.$type).toEqual("za.co.ciaran.cumulus.resolution");
    expect(resolution.market).toEqual({
        cid: CID.toString(cid),
        uri: `at://did:plc:example/za.co.ciaran.cumulus.market/${tid}`
    });
    expect(resolution.answer).toEqual("yes");
    expect(resolution.createdAt).toEqual("2026-02-25T11:52:33.278Z");
});
