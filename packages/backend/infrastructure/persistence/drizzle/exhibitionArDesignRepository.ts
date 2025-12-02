import type { D1Database } from '@cloudflare/workers-types'
import { eq, inArray } from 'drizzle-orm'

import { reconstructExhibitionArDesign } from '../../../domain/factories/exhibitionArDesign'
import type { ExhibitionArDesign as DomainExhibitionArDesign } from '../../../domain/models/exhibitionArDesign'
import type { ExhibitionArDesignRepository } from '../../../domain/repositories/exhibitionArDesign'
import { getDb } from './client'
import { exhibitionArDesign } from './schema/exhibitionArDesign'

type DbExhibitionArDesign = typeof exhibitionArDesign.$inferSelect

function mapToDomain(row: DbExhibitionArDesign): DomainExhibitionArDesign {
  return reconstructExhibitionArDesign({
    id: row.id,
    url: row.url ?? null,
  })
}

export function createExhibitionArDesignRepository(d1: D1Database): ExhibitionArDesignRepository {
  return new DrizzleExhibitionArDesignRepository(d1)
}

export class DrizzleExhibitionArDesignRepository implements ExhibitionArDesignRepository {
  private db: ReturnType<typeof getDb>

  constructor(d1: D1Database) {
    this.db = getDb(d1)
  }

  async save(design: DomainExhibitionArDesign): Promise<void> {
    await this.db
      .insert(exhibitionArDesign)
      .values({
        id: design.id,
        url: design.url ?? undefined,
      })
      .onConflictDoUpdate({
        target: exhibitionArDesign.id,
        set: {
          url: design.url ?? undefined,
        },
      })
      .run()
  }

  async findById(id: string): Promise<DomainExhibitionArDesign | null> {
    const row = await this.db
      .select()
      .from(exhibitionArDesign)
      .where(eq(exhibitionArDesign.id, id))
      .get()

    if (!row) return null
    return mapToDomain(row)
  }

  async findByIds(ids: string[]): Promise<DomainExhibitionArDesign[]> {
    if (ids.length === 0) return []

    const rows = await this.db
      .select()
      .from(exhibitionArDesign)
      .where(inArray(exhibitionArDesign.id, ids))
      .all()

    return rows.map(mapToDomain)
  }

  async findAll(): Promise<DomainExhibitionArDesign[]> {
    const rows = await this.db.select().from(exhibitionArDesign).all()
    return rows.map(mapToDomain)
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(exhibitionArDesign).where(eq(exhibitionArDesign.id, id)).run()
  }
}
