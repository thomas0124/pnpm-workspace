import { Hono } from 'hono'

import { handleUpdateExhibitionInformation } from '../../handlers/exhibition'
import type { Bindings } from '../../handlers/index'

export const exhibitionInformationRoutes = new Hono<{ Bindings: Bindings }>()

  // PUT /:exhibitionId/information - 基本情報の更新
  .put('/', ...handleUpdateExhibitionInformation)
