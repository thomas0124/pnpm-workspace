import { eq } from 'drizzle-orm'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import type { ExhibitionArDesign } from '../client'
import { exhibitionArDesignSchema } from '../client'

/**
 * ARデザインAPI（/api/ar-designs）の動作確認用 Seed
 */
type SeedDb = BetterSQLite3Database<typeof exhibitionArDesignSchema>

export async function seedArDesigns(db: SeedDb): Promise<void> {
  const { exhibitionArDesign } = exhibitionArDesignSchema

  // 固定ID（テストしやすいように決め打ち・すべてUUID形式）
  const arDesignIds = [
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
  ]

  // 既存データを削除
  for (const id of arDesignIds) {
    await db.delete(exhibitionArDesign).where(eq(exhibitionArDesign.id, id)).run()
  }

  // ARデザイン（さまざまなURLパターンを用意）
  const arDesignRows: ExhibitionArDesign[] = [
    {
      id: arDesignIds[0],
      url: 'https://example.com/ar/design-001',
    },
    {
      id: arDesignIds[1],
      url: 'https://example.com/ar/design-002',
    },
    {
      id: arDesignIds[2],
      url: 'https://ar-storage.example.com/models/exhibit-a.glb',
    },
    {
      id: arDesignIds[3],
      url: 'https://cdn.example.com/3d-models/interactive-booth.usdz',
    },
    {
      id: arDesignIds[4],
      url: 'https://assets.example.com/ar/vr-experience-space',
    },
  ]

  await db.insert(exhibitionArDesign).values(arDesignRows).run()

  console.log(`✅ ${arDesignRows.length}件のARデザインをシードしました`)
}
