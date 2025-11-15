FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/lib-b/package.json ./packages/lib-b/

RUN pnpm install --frozen-lockfile --reporter=silent

COPY . .

WORKDIR /workspace/packages/lib-b

RUN pnpm run build || true

EXPOSE 8787

RUN mkdir -p /workspace/data

CMD ["sh", "-c", "if [ -f ./dist/index.js ]; then node ./dist/index.js; else pnpm run dev; fi"]
