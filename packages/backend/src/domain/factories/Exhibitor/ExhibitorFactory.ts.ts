import { v4 as uuidv4 } from 'uuid';
import { ExhibitorSchema, type Exhibitor} from '../../models/Exhibitor/Exhibitor'

// 新規出店者を作成するファクトリー関数
export function createExhibitor(name: string, password_hash: string): Exhibitor {
  const now = new Date().toISOString()

  return ExhibitorSchema.parse({
    id: uuidv4(),
    name: name,
    password_hash: password_hash,
    created_at: now,
    updated_at: now,
  })
}

// DBから取得したデータを再構築
export function reconstructExhibitor(data: {
  id: string
  name: string
  password_hash: string
  created_at: string
  updated_at: string
}): Exhibitor {
  return ExhibitorSchema.parse(data)
}