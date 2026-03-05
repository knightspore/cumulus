FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

FROM deps AS jetstream-builder
COPY lex.config.js ./
COPY src ./src
RUN bun run jetstream:build

FROM deps AS web-builder
COPY lex.config.js ./
COPY src ./src
COPY vite.config.ts ./
RUN bun web:build

FROM deps AS server-builder
COPY src ./src
RUN bun run server:build

FROM oven/bun:1
WORKDIR /app

COPY --from=jetstream-builder /app/build/jetstream ./build/
COPY --from=server-builder /app/build/server ./build/
COPY --from=web-builder /app/dist ./dist

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
EXPOSE 80

CMD ["./entrypoint.sh"]
