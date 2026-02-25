import { defineLexiconConfig } from "@atcute/lex-cli";

export default defineLexiconConfig({
    files: ['src/market.ts'],
    outdir: 'src/lexicons/',
    export: {
        outdir: 'lexicons/',
        clean: true,
    }
});
