FROM oven/bun:1 AS jetstream-builder

WORKDIR /jetstream
COPY package.json bun.lock ./
RUN bun install
COPY ./lex.config.js ./
COPY ./src ./src
RUN bun run jetstream:build
RUN cd build && pwd

FROM oven/bun:1

WORKDIR /app

COPY --from=jetstream-builder /jetstream/build/jetstream ./

CMD ["./jetstream"]
