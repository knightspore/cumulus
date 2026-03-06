import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { ZaCoCiaranCumulusBet, ZaCoCiaranCumulusMarket, ZaCoCiaranCumulusResolution } from '../../generated/typescript';
import { is, type ActorIdentifier } from '@atcute/lexicons';
import type { CreateCommit, DeleteCommit } from '@atcute/jetstream';
import * as schema from "../db/schema"
import { DEFAULT_MARKET_COLS, DEFAULT_BET_COLS, DEFAULT_RESOLUTION_COLS } from '../db/schema';
import { eq } from 'drizzle-orm';


export const db = drizzle(process.env.DATABASE_URL!, { schema });

export async function tryListMarkets() {
    return await db.query.marketsTable.findMany({
        columns: DEFAULT_MARKET_COLS,
        orderBy: (markets, { desc }) => [desc(markets.createdAt)],
        with: {
            bets: { columns: DEFAULT_BET_COLS },
            resolution: { columns: DEFAULT_RESOLUTION_COLS }
        },
    })
}

export async function tryFindMarket(uri: string) {
    return await db.query.marketsTable.findFirst({
        columns: DEFAULT_MARKET_COLS,
        where: eq(schema.marketsTable.uri, uri),
        with: {
            bets: { columns: DEFAULT_BET_COLS },
            resolution: { columns: DEFAULT_RESOLUTION_COLS }
        }
    })
}

export async function tryFindMarketBets(uri: string) {
    return await db.query.betsTable.findMany({
        columns: DEFAULT_BET_COLS,
        where: eq(schema.betsTable.marketUri, uri),
        orderBy: (bets, { desc }) => [desc(bets.createdAt)],
        with: {
            market: {
                columns: DEFAULT_MARKET_COLS,
                with: { resolution: { columns: DEFAULT_RESOLUTION_COLS } }
            }
        }
    })
}

export async function tryFindMarketResolutions(uri: string) {
    return await db.query.resolutionsTable.findFirst({
        columns: DEFAULT_RESOLUTION_COLS,
        where: eq(schema.resolutionsTable.marketUri, uri),
        orderBy: (resolutions, { desc }) => [desc(resolutions.createdAt)],
        with: {
            market: {
                columns: DEFAULT_MARKET_COLS,
                with: { bets: { columns: DEFAULT_BET_COLS } }
            }
        }
    })
}

export async function tryCreateMarket(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusMarket.mainSchema, record)) {
        const uri = `at://${did}/${record.$type}/${rkey}`;
        console.log("> Creating Market:", uri);

        const { question, liquidity } = record;
        const [closesAt, createdAt] = [new Date(record.closesAt), new Date(record.createdAt)];

        const marketData: typeof schema.marketsTable.$inferInsert = {
            uri, did, rev, rkey, cid, question, liquidity, closesAt, record, createdAt,
        };

        await db.insert(schema.marketsTable).values(marketData);
        console.log("> Created Market!");
    }
}

export async function tryDeleteMarket(did: ActorIdentifier, commit: DeleteCommit) {
    const uri = `at://${did}/${commit.collection}/${commit.rkey}`;
    console.log("> Deleting Market:", uri);
    await db.delete(schema.marketsTable).where(eq(schema.marketsTable.uri, uri))
}

export async function tryCreateBet(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusBet.mainSchema, record)) {
        const uri = `at://${did}/${record.$type}/${rkey}`;
        console.log("> Creating Bet:", uri);
        const { position, market } = record;
        const createdAt = new Date(record.createdAt);

        const betData: typeof schema.betsTable.$inferInsert = {
            uri, did, rev, rkey, cid, position, marketUri: market.uri, record, createdAt
        }

        await db.insert(schema.betsTable).values(betData);
        console.log("> Created Bet!");
    }
}

export async function tryDeleteBet(did: ActorIdentifier, commit: DeleteCommit) {
    const uri = `at://${did}/${commit.collection}/${commit.rkey}`;
    console.log("> Deleting Bet:", uri);
    await db.delete(schema.betsTable).where(eq(schema.betsTable.uri, uri))
}

export async function tryCreateResolution(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusResolution.mainSchema, record)) {
        const uri = `at://${did}/${record.$type}/${rkey}`;
        console.log("> Creating Resolution:", uri);
        const { answer, market } = record;
        const createdAt = new Date(record.createdAt);

        const resolutionData: typeof schema.resolutionsTable.$inferInsert = {
            uri, did, rev, rkey, cid, answer, marketUri: market.uri, record, createdAt
        }

        await db.insert(schema.resolutionsTable).values(resolutionData);
        console.log("> Created Resolution!");
    }
}

export async function tryDeleteResolution(did: ActorIdentifier, commit: DeleteCommit) {
    const uri = `at://${did}/${commit.collection}/${commit.rkey}`;
    console.log("> Deleting Resolution:", uri);
    await db.delete(schema.resolutionsTable).where(eq(schema.resolutionsTable.uri, uri))
}
