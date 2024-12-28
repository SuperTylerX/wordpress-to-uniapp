import { get, postJSON } from '@/api/utils'
import { WORDPRESS_REST_API_URL } from '@/config'
import type { Tag } from '@/types/tag'

// 获取标签列表
export const getTagList = (args: {
  post?: number
  search?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count'
  per_page?: number
  include?: number[]
}) => get<Tag[]>(`${WORDPRESS_REST_API_URL}/tags`, args)

// 获取标签详情
export const getTag = (id: number) => get<Tag>(`${WORDPRESS_REST_API_URL}/tags/${id}`)

// 新增标签
export const createTag = ({ name }: { name: string }) =>
  postJSON<Tag>(`${WORDPRESS_REST_API_URL}/tags`, { name }, {})
