import { text, integer, json, pgTable, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

const SHARED_SCHEMA = {
    uri: text().primaryKey().notNull(),
    did: text().notNull(),
    rev: text().notNull(),
    rkey: text().notNull(),
    cid: text().notNull(),
    record: json().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
}

export const betPositionEnum = pgEnum("bet_position", ["yes", "no"]);
export const resolutionAnswerEnum = pgEnum("resolution_answer", ["yes", "no"]);

export const marketsTable = pgTable("markets", {
    ...SHARED_SCHEMA,
    question: text().notNull(),
    liquidity: integer().notNull(),
    closesAt: timestamp({ withTimezone: true }).notNull(),
});

export const DEFAULT_MARKET_COLS = {
    uri: true,
    did: true,
    cid: true,
    question: true,
    liquidity: true,
    closesAt: true,
    createdAt: true,
}

export const betsTable = pgTable("bets", {
    ...SHARED_SCHEMA,
    position: betPositionEnum().notNull(),
    marketUri: text().notNull().references(() => marketsTable.uri),
});

export const DEFAULT_BET_COLS = {
    uri: true,
    did: true,
    cid: true,
    position: true,
    createdAt: true,
}

export const resolutionsTable = pgTable("resolutions", {
    ...SHARED_SCHEMA,
    answer: resolutionAnswerEnum().notNull(),
    marketUri: text().notNull().unique().references(() => marketsTable.uri),
});

export const DEFAULT_RESOLUTION_COLS = {
    uri: true,
    did: true,
    cid: true,
    answer: true,
    createdAt: true,
}

export const marketsRelations = relations(marketsTable, ({ many, one }) => ({
    bets: many(betsTable),
    resolution: one(resolutionsTable),
}));

export const betsRelations = relations(betsTable, ({ one }) => ({
    market: one(marketsTable, {
        fields: [betsTable.marketUri],
        references: [marketsTable.uri],
    }),
}));

export const resolutionsRelations = relations(resolutionsTable, ({ one }) => ({
    market: one(marketsTable, {
        fields: [resolutionsTable.marketUri],
        references: [marketsTable.uri],
    }),
}));

export const db = drizzle(process.env.DATABASE_URL!, {
    schema: {
        marketsTable,
        betsTable,
        resolutionsTable,
        marketsRelations,
        betsRelations,
        resolutionsRelations
    }
});
