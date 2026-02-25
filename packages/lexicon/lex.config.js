import { defineLexiconConfig } from "@atcute/lex-cli";

export default defineLexiconConfig({
    files: [
        'src/bet.ts',
        'src/market.ts',
        'src/resolution.ts'
    ],
    outdir: 'src/lexicons/',
    export: {
        outdir: 'lexicons/',
        clean: true,
    }
});
