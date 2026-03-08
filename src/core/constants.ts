import { z } from "zod"

export enum Lexicon {
    MARKET = 'za.co.ciaran.cumulus.market',
    BET = 'za.co.ciaran.cumulus.bet',
    RESOLUTION = 'za.co.ciaran.cumulus.resolution',
}

export const ENV = z.object({
    PORT: z.coerce.number(),
    BASE_URL: z.url(),
    DATABASE_URL: z.stringFormat("postgresql://", (val) => val.startsWith("postgresql://")),
}).parse(process.env);
