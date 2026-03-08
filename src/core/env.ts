import { z } from "zod"

export const ENV = z.object({
    PORT: z.string(),
    DATABASE_URL: z.stringFormat("postgresql://", (val) => val.startsWith("postgresql://")),
}).parse(import.meta.env);
