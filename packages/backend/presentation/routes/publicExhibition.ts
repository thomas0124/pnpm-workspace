import { Hono } from 'hono'

import {
  handleGetPublicExhibition,
  handleGetPublicExhibitionCategories,
  handleGetPublicExhibitions,
} from '../handlers/publicExhibition'
import type { Bindings } from '../handlers/index'

export const publicExhibitionRoutes = new Hono<{ Bindings: Bindings }>()

publicExhibitionRoutes.get('/public/exhibitions', handleGetPublicExhibitions)
publicExhibitionRoutes.get('/public/exhibitions/categories', handleGetPublicExhibitionCategories)
publicExhibitionRoutes.get('/public/exhibitions/:exhibition_id', handleGetPublicExhibition)
