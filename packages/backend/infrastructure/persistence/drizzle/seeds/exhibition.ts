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

  // 固定ID(テストしやすいように決め打ち・すべてUUID形式)
  const exhibitorIds = [
    '7c64d3d8-2fe4-4042-bf3d-0c6840016f39',
    '8d75e4e9-3af5-5153-ca4e-1d7951127f40',
    '9e86f5fa-4ba6-6264-da5f-2e8a6223a517',
    'af97a6ab-5cb7-7375-eb6a-3f9b7334b62f',
  ]

  const arDesignIds = [
    '53486767-131a-402f-92b2-629a7915765d',
    '35039280-460a-412a-9104-2716738437e4',
  ]

  const exhibitionInformationIds = [
    '2b5d3536-9646-439f-8933-42803898c043',
    '39204500-3255-44a8-979f-195216201943',
    '72258994-75e2-493e-a766-134a10289512',
    'f4584736-71e9-435a-882e-876892601900',
  ]

  const exhibitionIds = [
    '52097100-d270-4e17-8744-211c206f1327',
    '89761862-4706-4051-899e-a50e63989064',
    '07779520-190c-4e0f-8799-843355204935',
    '39204500-3255-44a8-979f-195216201943',
  ]

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

  for (const id of exhibitorIds) {
    await db.delete(exhibitor).where(eq(exhibitor.id, id)).run()
  }

  // 出展者（各出展情報ごとに異なる出展者を作成）
  const exhibitorRows: Exhibitor[] = exhibitorIds.map((id, index) => ({
    id,
    name: `Seed Exhibitor ${index + 1}`,
    passwordHash: 'dummy-hash', // テスト用途なので実際のハッシュでなくてOK
    createdAt: now,
    updatedAt: now,
  }))

  await db.insert(exhibitor).values(exhibitorRows).run()

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
      exhibitorId: exhibitorIds[0],
      exhibitionArDesignId: arDesignIds[0],
      exhibitorName: 'Seed Exhibitor 1',
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
      exhibitorId: exhibitorIds[1],
      exhibitionArDesignId: arDesignIds[1],
      exhibitorName: 'Seed Exhibitor 2',
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
      exhibitorId: exhibitorIds[2],
      exhibitionArDesignId: null,
      exhibitorName: 'Seed Exhibitor 3',
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
      exhibitorId: exhibitorIds[3],
      exhibitionArDesignId: null,
      exhibitorName: 'Seed Exhibitor 4',
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
        exhibitorId: exhibitorIds[0],
        exhibitionInformationId: exhibitionInformationIds[0],
        isDraft: 0,
        isPublished: 1,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: exhibitionIds[1],
        exhibitorId: exhibitorIds[1],
        exhibitionInformationId: exhibitionInformationIds[1],
        isDraft: 0,
        isPublished: 1,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: exhibitionIds[2],
        exhibitorId: exhibitorIds[2],
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
        exhibitorId: exhibitorIds[3],
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
