

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

## 貢献

1. Issue を立てて目的を共有してください。
2. ブランチを切って作業してください。

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