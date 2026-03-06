import { parse } from "@atcute/lexicons";
import { it, expect } from "vitest";
import { ZaCoCiaranCumulusMarket } from "../../generated/typescript";
import { Lexicon } from "@/core/constants";

const data = {
    $type: Lexicon.MARKET,
    question: "Will I sleep tonight?",
    liquidity: 50,
    closesAt: "2026-03-25T11:52:33.278Z",
    createdAt: "2026-02-25T11:52:33.278Z",
}

it("market schema validation", () => {
    const market = parse(ZaCoCiaranCumulusMarket.mainSchema, data);
    expect(market.$type).toEqual(Lexicon.MARKET);
    expect(market.question).toEqual("Will I sleep tonight?");
    expect(market.liquidity).toEqual(50);
    expect(market.closesAt).toEqual("2026-03-25T11:52:33.278Z");
    expect(market.createdAt).toEqual("2026-02-25T11:52:33.278Z");
});
