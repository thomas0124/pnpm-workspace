import { Hono } from 'hono'

import type { Bindings } from '../handlers/index'
import {
  handleGetPublicExhibitionCategories,
  handleGetPublicExhibitions,
} from '../handlers/publicExhibition'

export const publicExhibitionRoutes = new Hono<{ Bindings: Bindings }>()

publicExhibitionRoutes.get('/public/exhibitions', handleGetPublicExhibitions)
publicExhibitionRoutes.get('/public/exhibitions/categories', handleGetPublicExhibitionCategories)
