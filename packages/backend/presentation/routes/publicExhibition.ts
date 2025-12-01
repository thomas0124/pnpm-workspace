import { Hono } from 'hono'

import {
  handleGetPublicExhibition,
  handleGetPublicExhibitionCategories,
  handleGetPublicExhibitionImage,
  handleGetPublicExhibitions,
} from '../handlers/publicExhibition'

type Bindings = {
  DB: D1Database
}

export const publicExhibitionRoutes = new Hono<{ Bindings: Bindings }>()

publicExhibitionRoutes.get('/public/exhibitions', handleGetPublicExhibitions)
publicExhibitionRoutes.get('/public/exhibitions/categories', handleGetPublicExhibitionCategories)
publicExhibitionRoutes.get('/public/exhibitions/:exhibition_id', handleGetPublicExhibition)
publicExhibitionRoutes.get(
  '/public/exhibitions/:exhibition_id/image',
  handleGetPublicExhibitionImage
)
