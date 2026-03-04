import { document, integer, object, record, required, string } from "@atcute/lexicon-doc/builder";

const data = {
    description: 'The record containing a Cumulus Market',
}

export default document({
    id: 'za.co.ciaran.cumulus.market',
    description: data.description,
    defs: {
        main: record({
            key: 'tid',
            description: 'The record containing a Cumulus Market',
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
