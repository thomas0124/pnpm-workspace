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

WORKDIR /workspace/packages/backend

# TypeScript をビルド
RUN pnpm run build || true

# SQLite データディレクトリを作成
RUN mkdir -p /workspace/data

EXPOSE 8787

# dev スクリプト実行（echo のみだが、必要なら実装可能）
CMD ["pnpm", "run", "dev"]
