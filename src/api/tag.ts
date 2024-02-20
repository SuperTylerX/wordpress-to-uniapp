import { WORDPRESS_REST_API_URL } from '@/config'
import { get } from '@/api/utils'
import type { Tag } from '@/types/tag'

export const getTagList = (args: { post: number }) =>
  get<Tag[]>(`${WORDPRESS_REST_API_URL}/tags`, args)

export const getTag = (id: number) => get<Tag>(`${WORDPRESS_REST_API_URL}/tags/${id}`)
