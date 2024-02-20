import { WORDPRESS_REST_API_URL } from '@/config'
import { get } from '@/api/utils'
import type { Tag } from '@/types/tag'

export const getPostTag = (args: { post: number }) =>
  get<Tag[]>(`${WORDPRESS_REST_API_URL}/tags`, args)
