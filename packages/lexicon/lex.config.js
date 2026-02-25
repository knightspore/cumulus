import { defineLexiconConfig } from "@atcute/lex-cli";

export default defineLexiconConfig({
    files: [
        // 'src/bet.ts',
        'src/market.ts',
        'src/resolution.ts'
    ],
    outdir: 'generated/typescript',
    export: {
        outdir: 'generated/json',
        clean: true,
    },
    imports: ['@atcute/atproto']
});
