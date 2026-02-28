import { defineLexiconConfig } from "@atcute/lex-cli";

export default defineLexiconConfig({
    imports: ['@atcute/atproto'],
    files: [
        'src/lexicon/bet.ts',
        'src/lexicon/market.ts',
        'src/lexicon/resolution.ts'
    ],
    outdir: 'generated/typescript',
    export: {
        outdir: 'generated/json',
        clean: true,
    }
});
