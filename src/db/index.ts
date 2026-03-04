import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { ZaCoCiaranCumulusMarket } from '../../generated/typescript';
import { marketsTable } from './schema';
import { is, type ActorIdentifier } from '@atcute/lexicons';
import type { CreateCommit } from '@atcute/jetstream';
import * as schema from "./schema"

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export async function tryCreateMarket(did: ActorIdentifier, { record, rev, rkey, cid }: CreateCommit) {
    if (is(ZaCoCiaranCumulusMarket.mainSchema, record)) {
        console.log("> Creating Market: ", rkey);
        const marketData: typeof marketsTable.$inferInsert = {
            uri: `at://${did}/${record.$type}/${rkey}`,
            did,
            rev,
            rkey,
            cid,
            question: record.question,
            liquidity: record.liquidity,
            closesAt: new Date(record.closesAt),
            record,
            createdAt: new Date(record.createdAt),
        };

        await db.insert(marketsTable).values(marketData);
        console.log("> Created Market!");

        const markets = await db.select().from(marketsTable);
        console.log("Getting all markets from the database: ", markets);
    }
}
