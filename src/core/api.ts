import 'dotenv/config';
import { ZaCoCiaranCumulusBet, ZaCoCiaranCumulusMarket, ZaCoCiaranCumulusResolution } from '../../generated/typescript';
import { is, type ActorIdentifier } from '@atcute/lexicons';
import type { CreateCommit, DeleteCommit } from '@atcute/jetstream';
import { DEFAULT_MARKET_COLS, DEFAULT_BET_COLS, DEFAULT_RESOLUTION_COLS, marketsTable, betsTable, resolutionsTable } from '@/db'
import { eq } from 'drizzle-orm';
import { db } from '@/db';

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
        where: eq(marketsTable.uri, uri),
        with: {
            bets: { columns: DEFAULT_BET_COLS },
            resolution: { columns: DEFAULT_RESOLUTION_COLS }
        }
    })
}

export async function tryFindMarketBets(uri: string) {
    return await db.query.betsTable.findMany({
        columns: DEFAULT_BET_COLS,
        where: eq(betsTable.marketUri, uri),
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
        where: eq(resolutionsTable.marketUri, uri),
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

        const marketData: typeof marketsTable.$inferInsert = {
            uri, did, rev, rkey, cid, question, liquidity, closesAt, record, createdAt,
        };

        await db.insert(marketsTable).values(marketData);
        console.log("> Created Market!");
    }
}

export async function tryDeleteMarket(did: ActorIdentifier, commit: DeleteCommit) {
    const uri = `at://${did}/${commit.collection}/${commit.rkey}`;
    console.log("> Deleting Market:", uri);
    await db.delete(marketsTable).where(eq(marketsTable.uri, uri))
}

export async function tryCreateBet(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusBet.mainSchema, record)) {
        const uri = `at://${did}/${record.$type}/${rkey}`;
        console.log("> Creating Bet:", uri);
        const { position, market } = record;
        const createdAt = new Date(record.createdAt);

        const betData: typeof betsTable.$inferInsert = {
            uri, did, rev, rkey, cid, position, marketUri: market.uri, record, createdAt
        }

        await db.insert(betsTable).values(betData);
        console.log("> Created Bet!");
    }
}

export async function tryDeleteBet(did: ActorIdentifier, commit: DeleteCommit) {
    const uri = `at://${did}/${commit.collection}/${commit.rkey}`;
    console.log("> Deleting Bet:", uri);
    await db.delete(betsTable).where(eq(betsTable.uri, uri))
}

export async function tryCreateResolution(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusResolution.mainSchema, record)) {
        const uri = `at://${did}/${record.$type}/${rkey}`;
        console.log("> Creating Resolution:", uri);
        const { answer, market } = record;
        const createdAt = new Date(record.createdAt);

        const resolutionData: typeof resolutionsTable.$inferInsert = {
            uri, did, rev, rkey, cid, answer, marketUri: market.uri, record, createdAt
        }

        await db.insert(resolutionsTable).values(resolutionData);
        console.log("> Created Resolution!");
    }
}

export async function tryDeleteResolution(did: ActorIdentifier, commit: DeleteCommit) {
    const uri = `at://${did}/${commit.collection}/${commit.rkey}`;
    console.log("> Deleting Resolution:", uri);
    await db.delete(resolutionsTable).where(eq(resolutionsTable.uri, uri))
}
