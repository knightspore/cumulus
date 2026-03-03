import { type ActorIdentifier, parse } from "@atcute/lexicons";
import { ZaCoCiaranCumulusBet, ZaCoCiaranCumulusMarket, ZaCoCiaranCumulusResolution } from "../../generated/typescript";
import { Client } from "@atcute/client"
import type { ComAtprotoRepoStrongRef } from "@atcute/atproto";

export async function createMarket(
    question: ZaCoCiaranCumulusMarket.Main['question'],
    liquidity: ZaCoCiaranCumulusMarket.Main['liquidity'],
    closesAt: ZaCoCiaranCumulusMarket.Main['closesAt'],
    repo: ActorIdentifier,
    client: Client
) {
    const record = parse(ZaCoCiaranCumulusMarket.mainSchema, {
        $type: "za.co.ciaran.cumulus.market",
        question,
        liquidity,
        closesAt,
        createdAt: new Date().toISOString()
    })

    const response = await client.post('com.atproto.repo.createRecord', {
        input: { repo, collection: record.$type, record }
    })

    if (!response.ok) {
        throw new Error("Error creating market: " + JSON.stringify(response));
    }

    return response.data;
}

export async function createResolution(
    market: ComAtprotoRepoStrongRef.Main,
    answer: "yes" | "no",
    repo: ActorIdentifier,
    client: Client
) {
    const record = parse(ZaCoCiaranCumulusResolution.mainSchema, {
        $type: "za.co.ciaran.cumulus.resolution",
        market,
        answer,
        createdAt: new Date().toISOString()
    })

    const response = await client.post('com.atproto.repo.createRecord', {
        input: { repo, collection: record.$type, record }
    })

    if (!response.ok) {
        throw new Error("Error creating resolution: " + JSON.stringify(response));
    }

    return response.data;
}

export async function createBet(
    market: ComAtprotoRepoStrongRef.Main,
    position: "yes" | "no",
    repo: ActorIdentifier,
    client: Client,
) {
    const record = parse(ZaCoCiaranCumulusBet.mainSchema, {
        $type: "za.co.ciaran.cumulus.bet",
        market,
        position,
        createdAt: new Date().toISOString()
    })

    const response = await client.post('com.atproto.repo.createRecord', {
        input: { repo, collection: record.$type, record },
    });

    if (!response.ok) {
        throw new Error("Error creating bet: " + JSON.stringify(response));
    }

    return response.data;
}
