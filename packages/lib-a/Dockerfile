FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/lib-a/package.json ./packages/lib-a/
COPY packages/lib-b/package.json ./packages/lib-b/

RUN pnpm install --frozen-lockfile --reporter=silent

# Copy the rest of the workspace
COPY . .

WORKDIR /workspace/packages/lib-a

EXPOSE 3000

# Start Next.js dev server
CMD ["pnpm", "dev"]
