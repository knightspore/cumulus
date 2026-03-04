import { document, object, record, required, string, ref } from "@atcute/lexicon-doc/builder";

const data = {
    description: 'The record containing the Resolution for a Cumulus Market',
    marketRefDescription: 'The record containing the Cumulus Market for this Resolution'
}

export default document({
    id: 'za.co.ciaran.cumulus.resolution',
    description: data.description,
    defs: {
        main: record({
            key: 'tid',
            description: data.description,
            record: object({
                properties: {
                    market: required(ref({ ref: 'com.atproto.repo.strongRef', description: data.marketRefDescription })),
                    answer: required(string({ enum: ["yes", "no"], minLength: 2, maxLength: 3 })),
                    createdAt: required(string({ format: "datetime" })),
                }
            })
        })
    }
});
