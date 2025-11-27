import { Exhibitor } from '../../models/Exhibitor/Exhibitor'
export type ExhibitorRepository = {
  findByUsername(name: string): Promise<Exhibitor | null>
  save: (exhibitor: Exhibitor) => Promise<void>
  findById: (id: string) => Promise<Exhibitor | null>
  delete: (id: string) => Promise<void>
}