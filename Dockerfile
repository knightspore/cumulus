FROM oven/bun:1 AS jetstream-builder

WORKDIR /jetstream
COPY package.json bun.lock ./
RUN bun install
COPY ./src ./src
RUN bun run jetstream:build
RUN cd dist && pwd

FROM oven/bun:1

WORKDIR /app

COPY --from=jetstream-builder /jetstream/dist/jetstream ./

CMD ["./jetstream"]
