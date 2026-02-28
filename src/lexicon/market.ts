import { document, integer, object, record, required, string } from "@atcute/lexicon-doc/builder";

export default document({
    id: 'za.co.ciaran.cumulus.market',
    description: 'The record containing a Cumulus Market',
    revision: 1,
    defs: {
        main: record({
            key: 'tid',
            record: object({
                properties: {
                    question: required(string({ maxLength: 140 })),
                    liquidity: required(integer({ enum: [10, 50, 200] })),
                    closesAt: required(string({ format: "datetime" })),
                    createdAt: required(string({ format: "datetime" })),
                }
            })
        })
    }
});
