import { document, object, record, ref, required, string } from "@atcute/lexicon-doc/builder";

export default document({
    id: 'za.co.ciaran.cumulus.bet',
    description: 'The record containing a Bet placed on a Cumulus Market',
    revision: 1,
    defs: {
        main: record({
            key: 'tid',
            record: object({
                properties: {
                    market: required(ref({
                        ref: 'com.atproto.repo.strongRef',
                        description: 'The record containing the Cumulus Market for this Bet',
                    })),
                    position: required(string({ enum: ["yes", "no"] })),
                    createdAt: required(string({ format: "datetime" })),
                }
            })
        })
    }
});
