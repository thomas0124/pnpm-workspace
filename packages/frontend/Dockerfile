FROM node:20-alpine

# pnpm を有効化
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

WORKDIR /workspace

# ルートの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 各パッケージの package.json をコピー
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/

# 残りのソースコードをコピー
COPY . .

# ワークスペース全体の依存をインストール
RUN pnpm install --frozen-lockfile

# backend を TypeScript でビルド
RUN cd packages/backend && pnpm run build

WORKDIR /workspace/packages/frontend

EXPOSE 3000

# Next.js dev サーバを起動
CMD ["pnpm", "dev"]
