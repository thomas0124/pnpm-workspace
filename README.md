

# hacku2025

## 目次

- 概要
- 前提
- 技術スタック
- ローカル開発
- プロジェクト構成
- データベース
- デプロイメント（CI/CD）
- 貢献

## 概要

このリポジトリは小規模なモノレポ構成の例です。フロント側は `packages/frontend`、バック側は `packages/backend` に分かれています。各パッケージの実装やスクリプトはそれぞれの `package.json` を確認してください。

各パッケージの詳細な説明は以下のREADMEを参照してください：
- [フロントエンド README](packages/frontend/README.md)
- [バックエンド README](packages/backend/README.md)

## 前提

- Node.js（推奨バージョン: 20以上）
- pnpm（バージョン: >=9.15.0）

## 技術スタック

### モノレポ管理

- **Turbo**: ビルドシステムとタスクランナー
- **pnpm workspace**: パッケージ管理とワークスペース機能

### フロントエンド

- **Next.js 14**: Reactフレームワーク（App Router）
- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **Radix UI**: アクセシブルなUIコンポーネント

### バックエンド

- **Cloudflare Workers**: エッジコンピューティングプラットフォーム
- **Hono**: 軽量高速なWebフレームワーク
- **Drizzle ORM**: 型安全で軽量なORM
- **Cloudflare D1**: エッジで動くSQLiteデータベース
- **TypeScript**: 型安全性
- **DDD（ドメイン駆動設計）**: 4層アーキテクチャを採用

## ローカル開発

### セットアップ

```bash
# ルートで依存をインストール
pnpm install
```

### 開発サーバーの起動

Turboを使用して、すべてのパッケージを並行して開発できます：

```bash
# すべてのパッケージを同時に起動
pnpm dev

# フロントエンドのみ起動
pnpm dev:frontend

# バックエンドのみ起動
pnpm dev:backend
```

### 個別パッケージでの開発

各パッケージのディレクトリに移動して、個別にコマンドを実行することもできます：

```bash
# フロントエンド
cd packages/frontend
pnpm dev          # 開発サーバー起動
pnpm build        # ビルド
pnpm check        # 型チェック、リント、フォーマットチェック
pnpm fix          # リントとフォーマットの自動修正

# バックエンド
cd packages/backend
pnpm dev          # 開発サーバー起動（tsx watch）
pnpm build        # ビルド
pnpm check        # 型チェック、リント、フォーマットチェック
pnpm fix          # リントとフォーマットの自動修正
```

### ビルド

```bash
# すべてのパッケージをビルド
pnpm build
```

## プロジェクト構成

```
.
├─ package.json              # ルートのpackage.json（Turbo設定含む）
├─ pnpm-workspace.yaml      # pnpmワークスペース設定
├─ turbo.json               # Turbo設定
└─ packages/
    ├─ frontend/    # フロント（frontend）
    │  ├─ src/
    └─ backend/    # バック（backend）
         ├─ domain/
         ├─ application/
         ├─ infrastructure/
         ├─ presentation/
         └─ *.ts
```

## データベース

このプロジェクトは、**Cloudflare D1**（SQLiteベース）をデータベースとして使用し、**Drizzle ORM**でデータベースアクセスを管理しています。

### Drizzle ORM

- 型安全なORM
- マイグレーション管理
- SQLite（D1）対応

### マイグレーション

バックエンドパッケージで以下のコマンドを使用できます：

```bash
cd packages/backend

# マイグレーションファイルの生成
pnpm db:generate

# ローカルD1にマイグレーション適用
pnpm db:migrate:local

# リモートD1にマイグレーション適用（環境別）
pnpm db:migrate:remote:preview      # Preview環境
pnpm db:migrate:remote:staging      # Staging環境
pnpm db:migrate:remote:production   # Production環境
```

詳細は [バックエンド README](packages/backend/README.md) を参照してください。

## デプロイメント（CI/CD）

このプロジェクトは、Cloudflare（Pages, Workers, D1）を使用した自動デプロイを実装しています。

### 環境構成

| 環境 | トリガー | フロントエンド | バックエンド | データベース |
|------|---------|--------------|------------|------------|
| **Preview** | Pull Request作成時 | Cloudflare Workers | Cloudflare Workers | D1 (共有) |
| **Staging** | `develop`ブランチへのpush | Cloudflare Workers | Cloudflare Workers | D1 |
| **Production** | `main`ブランチへのpush | Cloudflare Workers | Cloudflare Workers | D1 |

### デプロイフロー

#### Preview環境（開発中の機能確認）
1. Pull Requestを作成
2. GitHub Actionsが自動的に実行
3. PR専用の環境がデプロイされる
   - Frontend: `https://ar-pamph-frontend-preview-pr-{PR番号}.sekibun3109.workers.dev`
   - Backend: `https://ar-pamph-preview.sekibun3109.workers.dev`
   - Database: `ar-pamph-db-preview` (共有)
4. PRにコメントでURLが通知される
5. レビュー時に実際の動作を確認可能

#### Staging環境（統合テスト）
1. `develop`ブランチにマージ/push
2. GitHub Actionsが自動的に実行
3. Staging環境にデプロイ
   - Frontend: `https://ar-pamph-frontend-staging.sekibun3109.workers.dev`
   - Backend: `https://ar-pamph-staging.sekibun3109.workers.dev`
   - Database: `ar-pamph-db-staging`

#### Production環境（本番リリース）
1. `main`ブランチにpush
2. GitHub Actionsが自動的に実行
3. 本番環境にデプロイ
   - Frontend: `https://ar-pamph-frontend.sekibun3109.workers.dev`
   - Backend: `https://ar-pamph.sekibun3109.workers.dev`
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
- ローカルで動作確認済みであること
- 型チェック、リント、フォーマットチェックが通ること（`pnpm check`）
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