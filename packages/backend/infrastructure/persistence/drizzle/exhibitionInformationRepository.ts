import { eq } from 'drizzle-orm'

import { reconstructExhibitionInformation } from '../../../domain/factories/exhibitionInformation'
import type { ExhibitionInformation as DomainExhibitionInformation } from '../../../domain/models/exhibitionInformation'
import type { ExhibitionInformationRepository } from '../../../domain/repositories/exhibitionInformation'
import { getDb } from './client'
import { exhibitionInformation } from './schema/exhibitionInformation'

type DbExhibitionInformation = typeof exhibitionInformation.$inferSelect

function mapToDomain(row: DbExhibitionInformation): DomainExhibitionInformation {
  return reconstructExhibitionInformation({
    id: row.id,
    exhibitorId: row.exhibitorId,
    exhibitionArDesignId: row.exhibitionArDesignId,
    exhibitorName: row.exhibitorName,
    title: row.title,
    category: row.category,
    location: row.location,
    price: row.price ?? null,
    requiredTime: row.requiredTime ?? null,
    comment: row.comment ?? null,
    image: row.image ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  })
}

export function createExhibitionInformationRepository(
  d1: D1Database
): ExhibitionInformationRepository {
  return new DrizzleExhibitionInformationRepository(d1)
}

export class DrizzleExhibitionInformationRepository implements ExhibitionInformationRepository {
  private db: ReturnType<typeof getDb>

  constructor(d1: D1Database) {
    this.db = getDb(d1)
  }

  async save(info: DomainExhibitionInformation): Promise<void> {
    await this.db
      .insert(exhibitionInformation)
      .values({
        id: info.id,
        exhibitorId: info.exhibitorId,
        exhibitionArDesignId: info.exhibitionArDesignId,
        exhibitorName: info.exhibitorName,
        title: info.title,
        category: info.category,
        location: info.location,
        price: info.price ?? undefined,
        requiredTime: info.requiredTime ?? undefined,
        comment: info.comment ?? undefined,
        image: info.image ? Buffer.from(info.image) : null,
        createdAt: info.createdAt,
        updatedAt: info.updatedAt,
      })
      .onConflictDoUpdate({
        target: exhibitionInformation.id,
        set: {
          exhibitorId: info.exhibitorId,
          exhibitionArDesignId: info.exhibitionArDesignId,
          exhibitorName: info.exhibitorName,
          title: info.title,
          category: info.category,
          location: info.location,
          price: info.price ?? undefined,
          requiredTime: info.requiredTime ?? undefined,
          comment: info.comment ?? undefined,
          image: info.image ? Buffer.from(info.image) : null,
          updatedAt: info.updatedAt,
        },
      })
      .run()
  }

  async findById(id: string): Promise<DomainExhibitionInformation | null> {
    const row = await this.db
      .select()
      .from(exhibitionInformation)
      .where(eq(exhibitionInformation.id, id))
      .get()

    if (!row) return null
    return mapToDomain(row)
  }

  async findByExhibitorId(exhibitorId: string): Promise<DomainExhibitionInformation[]> {
    const rows = await this.db
      .select()
      .from(exhibitionInformation)
      .where(eq(exhibitionInformation.exhibitorId, exhibitorId))
      .all()

    return rows.map(mapToDomain)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(exhibitionInformation).where(eq(exhibitionInformation.id, id)).run()
  }
}
