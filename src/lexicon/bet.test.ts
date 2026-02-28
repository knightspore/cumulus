import { parse } from "@atcute/lexicons";
import { it, expect } from "vitest";
import { ZaCoCiaranCumulusBet } from "../../generated/typescript";
import * as CID from "@atcute/cid";
import * as TID from "@atcute/tid";

const tid = TID.now();
const cid = await CID.create(0x71, new Uint8Array([20]))

const data = {
    $type: 'za.co.ciaran.cumulus.bet',
    market: {
        cid: CID.toString(cid),
        uri: `at://did:plc:example/za.co.ciaran.cumulus.market/${tid}`
    },
    position: "no",
    createdAt: "2026-02-25T11:52:33.278Z",
}

it("bet schema validation", () => {
    const bet = parse(ZaCoCiaranCumulusBet.mainSchema, data);
    expect(bet.$type).toEqual("za.co.ciaran.cumulus.bet");
    expect(bet.market).toEqual({
        cid: CID.toString(cid),
        uri: `at://did:plc:example/za.co.ciaran.cumulus.market/${tid}`
    });
    expect(bet.position).toEqual("no");
    expect(bet.createdAt).toEqual("2026-02-25T11:52:33.278Z");
});
