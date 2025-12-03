import Database from 'better-sqlite3'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import fs from 'fs'
import path from 'path'

import {
  exhibitionArDesignSchema,
  exhibitionInformationSchema,
  exhibitionSchema,
  exhibitorSchema,
} from '../client'
import { seedPublicExhibitions } from './exhibition'
import { seedArDesigns } from './exhibitionArDesign'

dotenv.config()

// 最新のローカルD1 SQLiteファイルを動的に検索
function getLatestLocalD1Path(): string {
  const d1Dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'

  if (!fs.existsSync(d1Dir)) {
    console.warn(
      '⚠️ ローカルD1ディレクトリが見つかりません。先に pnpm db:migrate:local を実行してください。'
    )
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
    console.warn(
      '⚠️ SQLiteファイルが見つかりません。先に pnpm db:migrate:local を実行してください。'
    )
    return ':memory:'
  }

  console.log(`✅ 使用するDB: ${files[0].path}`)
  return files[0].path
}

async function main() {
  const dbPath = getLatestLocalD1Path()
  const sqlite = new Database(dbPath)

  const db = drizzle(sqlite, {
    schema: {
      ...exhibitorSchema,
      ...exhibitionSchema,
      ...exhibitionInformationSchema,
      ...exhibitionArDesignSchema,
    },
  })

  await seedPublicExhibitions(db)
  await seedArDesigns(db)
}

main()
