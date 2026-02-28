import { document, object, record, required, string, ref } from "@atcute/lexicon-doc/builder";

export default document({
    id: 'za.co.ciaran.cumulus.resolution',
    description: 'The record containing the Resolution for a Cumulus Market',
    revision: 1,
    defs: {
        main: record({
            key: 'tid',
            record: object({
                properties: {
                    market: required(ref({
                        ref: 'com.atproto.repo.strongRef',
                        description: 'The record containing the Cumulus Market for this Resolution',
                    })),
                    answer: required(string({ enum: ["yes", "no"] })),
                    createdAt: required(string({ format: "datetime" })),
                }
            })
        })
    }
});
