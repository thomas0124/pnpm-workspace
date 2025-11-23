

# hacku2025

## 目次

- 概要
- 前提
- クイックスタート（Docker）
- ローカル開発（pnpm）
- プロジェクト構成
- 貢献

## 概要

このリポジトリは小規模なモノレポ構成の例です。フロント側は `packages/frontend`、バック側は `packages/backend` に分かれています。各パッケージの実装やスクリプトはそれぞれの `package.json` を確認してください。

## 前提

- Docker / Docker Compose（Docker Desktop 推奨）
- （ローカルで実行する場合）Node.js と pnpm

## クイックスタート（Docker）

プロジェクトルートにある `compose.yml` を使ってコンテナをビルドし、起動します。

```bash
# イメージをビルド
docker compose build

# コンテナを起動
docker compose up
```

上記でサービスが起動します。サービス名や公開ポートは `compose.yml` を参照してください。

## ローカル開発（pnpm）

ルートでワークスペースの依存をインストールし、個別パッケージで開発用コマンドを実行します。

```bash
# ルートで依存をインストール
pnpm install

# 例: フロントをローカルで起動
cd packages/frontend
pnpm install
pnpm dev

# 例: バックのビルドやテスト
cd ../backend
pnpm install
pnpm test
```

各パッケージの `package.json` に `dev`, `build`, `test` などが定義されていれば、そのスクリプトを使って作業してください。

## プロジェクト構成（抜粋）

```
.
├─ compose.yml
├─ package.json
├─ pnpm-workspace.yaml
└─ packages/
	 ├─ frontend/    # フロント（frontend）
	 │  ├─ src/
	 └─ backend/    # バック（backend）
		└─ src/
```

## デプロイメント（CI/CD）

このプロジェクトは、Cloudflare（Pages, Workers, D1）を使用した自動デプロイを実装しています。

### 環境構成

| 環境 | トリガー | フロントエンド | バックエンド | データベース |
|------|---------|--------------|------------|------------|
| **Preview** | Pull Request作成時 | Cloudflare Pages | Cloudflare Workers | D1 (PR毎に作成) |
| **Staging** | `develop`ブランチへのpush | Cloudflare Pages | Cloudflare Workers | D1 (共有) |
| **Production** | `main`ブランチへのマージ | Cloudflare Pages | Cloudflare Workers | D1 (共有) |

### デプロイフロー

#### Preview環境（開発中の機能確認）
1. Pull Requestを作成
2. GitHub Actionsが自動的に実行
3. PR専用の環境がデプロイされる（例: `preview-pr-123.ar-pamph.pages.dev`）
4. PRにコメントでURLが通知される
5. レビュー時に実際の動作を確認可能

#### Staging環境（統合テスト）
1. `develop`ブランチにマージ/push
2. GitHub Actionsが自動的に実行
3. Staging環境にデプロイ
   - Frontend: `https://ar-pamph-staging.pages.dev`
   - Backend: `https://ar-pamph-staging.workers.dev`
   - Database: `ar-pamph-db-staging`

#### Production環境（本番リリース）
1. `main`ブランチにマージ
2. GitHub Actionsが自動的に実行
3. 本番環境にデプロイ
   - Frontend: `https://ar-pamph.pages.dev`
   - Backend: `https://ar-pamph.workers.dev`
   - Database: `ar-pamph-db-production`

### ブランチ戦略

```
main (本番環境)
  ↑
  └─ develop (Staging環境)
       ↑
       └─ feature/xxx (Pull Request → Preview環境)
```

1. 新機能は `feature/xxx` ブランチで開発
2. Pull Requestを作成してPreview環境で確認
3. レビュー後、`develop` にマージしてStaging環境で統合テスト
4. 問題なければ `main` にマージして本番リリース

## 貢献

1. Issue を立てて目的を共有してください。
2. ブランチを切って作業してください。
3. テスト・ビルドを通してから Pull Request を作成してください。

PR 作成時の目安:
- Docker またはローカルで動作確認済みであること
- 必要なテストが追加されていること
- README の更新があれば反映すること

### Commit Message

```
feat: 新しい機能
fix: バグの修正
docs: ドキュメントのみの変更
refactor: 仕様に影響がないコード改善(リファクタ)
chore: ビルド、補助ツール、ライブラリ関連
```

### Branch Name

```
feat/機能名
fix/修正箇所
docs/ドキュメント名
refactor/機能名
chore/機能名

例: feat/add_login
```