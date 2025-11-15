FROM node:20-alpine

# pnpm を有効化
RUN corepack enable && corepack prepare pnpm@9.15.5 --activate

WORKDIR /workspace

# ルートの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 各パッケージの package.json をコピー
COPY packages/lib-a/package.json ./packages/lib-a/
COPY packages/lib-b/package.json ./packages/lib-b/

# ワークスペース全体の依存をインストール
RUN pnpm install --frozen-lockfile

# 残りのソースコードをコピー
COPY . .

# lib-b を TypeScript でビルド
RUN cd packages/lib-b && pnpm run build

WORKDIR /workspace/packages/lib-a

EXPOSE 3000

# Next.js dev サーバを起動
CMD ["pnpm", "dev"]
