FROM oven/bun:1.2.19

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "server.ts"]
