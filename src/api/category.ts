import { get } from '@/api/utils'
import { WORDPRESS_REST_API_URL } from '@/config'
import type { Category, GetCategoryParams } from '@/types/category'

export const getCategoryList = (params: GetCategoryParams) =>
  get<Category[]>(`${WORDPRESS_REST_API_URL}/categories`, params)

export const getCategory = (id: number) =>
  get<Category>(`${WORDPRESS_REST_API_URL}/categories/${id}`)
