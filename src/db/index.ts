import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { ZaCoCiaranCumulusBet, ZaCoCiaranCumulusMarket, ZaCoCiaranCumulusResolution } from '../../generated/typescript';
import { is, type ActorIdentifier } from '@atcute/lexicons';
import type { CreateCommit } from '@atcute/jetstream';
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export async function tryCreateMarket(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusMarket.mainSchema, record)) {
        console.log("> Creating Market:", rkey);

        const uri = `at://${did}/${record.$type}/${rkey}`;
        const { question, liquidity } = record;
        const [closesAt, createdAt] = [new Date(record.closesAt), new Date(record.createdAt)];

        const marketData: typeof schema.marketsTable.$inferInsert = {
            uri, did, rev, rkey, cid, question, liquidity, closesAt, record, createdAt,
        };

        await db.insert(schema.marketsTable).values(marketData);
        console.log("> Created Market!");
    }
}

export async function tryCreateBet(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusBet.mainSchema, record)) {
        console.log("> Creating Bet:", rkey);

        const uri = `at://${did}/${record.$type}/${rkey}`;
        const { position, market } = record;
        const createdAt = new Date(record.createdAt);

        const betData: typeof schema.betsTable.$inferInsert = {
            uri, did, rev, rkey, cid, position, marketUri: market.uri, record, createdAt
        }

        await db.insert(schema.betsTable).values(betData);
        console.log("> Created Bet!");
    }
}

export async function tryCreateResolution(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusResolution.mainSchema, record)) {
        console.log("> Creating Resolution:", rkey);

        const uri = `at://${did}/${record.$type}/${rkey}`;
        const { answer, market } = record;
        const createdAt = new Date(record.createdAt);

        const resolutionData: typeof schema.resolutionsTable.$inferInsert = {
            uri, did, rev, rkey, cid, answer, marketUri: market.uri, record, createdAt
        }

        await db.insert(schema.resolutionsTable).values(resolutionData);
        console.log("> Created Resolution!");
    }
}
