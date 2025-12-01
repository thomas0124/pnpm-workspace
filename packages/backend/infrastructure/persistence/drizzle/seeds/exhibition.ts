import { eq } from 'drizzle-orm'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import type { ExhibitionArDesign, ExhibitionInformation, Exhibitor } from '../client'
import {
  exhibitionArDesignSchema,
  exhibitionInformationSchema,
  exhibitionSchema,
  exhibitorSchema,
} from '../client'

/**
 * 公開出展API（/public/exhibitions 系）の動作確認用 Seed
 */
type SeedDb = BetterSQLite3Database<
  typeof exhibitorSchema &
    typeof exhibitionSchema &
    typeof exhibitionInformationSchema &
    typeof exhibitionArDesignSchema
>

export async function seedPublicExhibitions(db: SeedDb): Promise<void> {
  const { exhibitor } = exhibitorSchema
  const { exhibitionArDesign } = exhibitionArDesignSchema
  const { exhibitionInformation } = exhibitionInformationSchema
  const { exhibition } = exhibitionSchema

  // 固定ID（テストしやすいように決め打ち）
  const exhibitorId = 'exhibitor-seed-1'

  const arDesignIds = ['ar-design-seed-1', 'ar-design-seed-2'] as const

  const exhibitionInformationIds = [
    'exhibition-information-seed-1',
    'exhibition-information-seed-2',
    'exhibition-information-seed-3',
    'exhibition-information-seed-draft-1',
  ] as const

  const exhibitionIds = [
    'exhibition-seed-1',
    'exhibition-seed-2',
    'exhibition-seed-3',
    'exhibition-seed-draft-1',
  ] as const

  const now = new Date().toISOString()

  // 既存データを削除（FK制約の都合上、子テーブルから順に削除）
  for (const id of exhibitionIds) {
    await db.delete(exhibition).where(eq(exhibition.id, id)).run()
  }

  for (const id of exhibitionInformationIds) {
    await db.delete(exhibitionInformation).where(eq(exhibitionInformation.id, id)).run()
  }

  for (const id of arDesignIds) {
    await db.delete(exhibitionArDesign).where(eq(exhibitionArDesign.id, id)).run()
  }

  await db.delete(exhibitor).where(eq(exhibitor.id, exhibitorId)).run()

  // 出展者
  const exhibitorRow: Exhibitor = {
    id: exhibitorId,
    name: 'Seed Exhibitor',
    passwordHash: 'dummy-hash', // テスト用途なので実際のハッシュでなくてOK
    createdAt: now,
    updatedAt: now,
  }

  await db.insert(exhibitor).values(exhibitorRow).run()

  // ARデザイン（URLだけ持つシンプルなものを複数パターン用意）
  const arDesignRows: ExhibitionArDesign[] = [
    {
      id: arDesignIds[0],
      url: 'https://example.com/ar/seed-1',
    },
    {
      id: arDesignIds[1],
      url: 'https://example.com/ar/seed-2',
    },
  ]

  await db.insert(exhibitionArDesign).values(arDesignRows).run()

  // 出展情報（カテゴリや金額・所要時間にバリエーションを持たせる）
  const exhibitionInformationRows: ExhibitionInformation[] = [
    {
      id: exhibitionInformationIds[0],
      exhibitorId,
      exhibitionArDesignId: arDesignIds[0],
      exhibitorName: 'Seed Exhibitor',
      title: 'Seed Exhibition Title - 展示',
      category: '展示',
      location: 'A-01',
      price: 500,
      requiredTime: 30,
      comment: 'これは公開出展API確認用の「展示」カテゴリのシードデータです。',
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: exhibitionInformationIds[1],
      exhibitorId,
      exhibitionArDesignId: arDesignIds[1],
      exhibitorName: 'Seed Exhibitor',
      title: 'Seed Exhibition Title - 体験',
      category: '体験',
      location: 'B-02',
      price: 0,
      requiredTime: 15,
      comment: 'これは公開出展API確認用の「体験」カテゴリのシードデータです。',
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: exhibitionInformationIds[2],
      exhibitorId,
      exhibitionArDesignId: null,
      exhibitorName: 'Seed Exhibitor',
      title: 'Seed Exhibition Title - 飲食',
      category: '飲食',
      location: 'C-03',
      price: 800,
      requiredTime: 10,
      comment: 'これは公開出展API確認用の「飲食」カテゴリのシードデータです。',
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      // 非公開（ドラフト）用の出展情報
      id: exhibitionInformationIds[3],
      exhibitorId,
      exhibitionArDesignId: null,
      exhibitorName: 'Seed Exhibitor',
      title: 'Draft Exhibition Title - 展示',
      category: '展示',
      location: 'D-04',
      price: 300,
      requiredTime: 20,
      comment: 'これはドラフト状態の出展に紐づくシードデータです（公開APIには出てきません）。',
      image: null,
      createdAt: now,
      updatedAt: now,
    },
  ]

  await db.insert(exhibitionInformation).values(exhibitionInformationRows).run()

  // 出展（公開済み + 非公開ドラフト）
  await db
    .insert(exhibition)
    .values([
      {
        id: exhibitionIds[0],
        exhibitorId,
        exhibitionInformationId: exhibitionInformationIds[0],
        isDraft: 0,
        isPublished: 1,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: exhibitionIds[1],
        exhibitorId,
        exhibitionInformationId: exhibitionInformationIds[1],
        isDraft: 0,
        isPublished: 1,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: exhibitionIds[2],
        exhibitorId,
        exhibitionInformationId: exhibitionInformationIds[2],
        isDraft: 0,
        isPublished: 1,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        // ドラフト（非公開）出展。公開APIでは取得されないことを確認するためのデータ
        id: exhibitionIds[3],
        exhibitorId,
        exhibitionInformationId: exhibitionInformationIds[3],
        isDraft: 1,
        isPublished: 0,
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .run()
}
