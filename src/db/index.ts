import { text, integer, json, pgTable, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { ENV } from "@/core/constants";

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

export const betsTable = pgTable("bets", {
    ...SHARED_SCHEMA,
    position: betPositionEnum().notNull(),
    marketUri: text().notNull().references(() => marketsTable.uri),
}, (table) => [
        index('bets_market_uri_idx').on(table.marketUri),
]);

export const resolutionsTable = pgTable("resolutions", {
    ...SHARED_SCHEMA,
    answer: resolutionAnswerEnum().notNull(),
    marketUri: text().notNull().unique().references(() => marketsTable.uri),
});

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

export const db = drizzle(ENV.DATABASE_URL, {
    schema: {
        marketsTable,
        betsTable,
        resolutionsTable,
        marketsRelations,
        betsRelations,
        resolutionsRelations
    }
});
