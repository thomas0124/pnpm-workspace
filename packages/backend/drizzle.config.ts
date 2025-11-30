import { defineConfig } from 'drizzle-kit'
import fs from 'fs'
import path from 'path'

// 最新のローカルD1 SQLiteファイルを動的に検索
function getLatestLocalD1Path(): string {
  const d1Dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'

  if (!fs.existsSync(d1Dir)) {
    console.warn('⚠️ ローカルD1ディレクトリが見つかりません。先に pnpm db:migrate:local を実行してください。')
    return ':memory:'
  }

  const files = fs
    .readdirSync(d1Dir)
    .filter((f) => f.endsWith('.sqlite'))
    .map((f) => ({
      name: f,
      path: path.join(d1Dir, f),
      mtime: fs.statSync(path.join(d1Dir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.mtime - a.mtime) // 更新日時の降順でソート

  if (files.length === 0) {
    console.warn('⚠️ SQLiteファイルが見つかりません。先に pnpm db:migrate:local を実行してください。')
    return ':memory:'
  }

  console.log(`✅ 使用するDB: ${files[0].path}`)
  return files[0].path
}

// CI環境チェック
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  out: './infrastructure/persistence/drizzle/migrations',
  schema: './infrastructure/persistence/drizzle/schema/*.ts',
  dialect: 'sqlite',
  dbCredentials: {
    // ローカル開発環境でのみローカルD1を使用
    // CI環境では使用されない（マイグレーション生成はローカルで実施）
    url: isCI ? ':memory:' : getLatestLocalD1Path(),
  },
})