export interface GetCategoryParams {
  context?: 'view' | 'embed' | 'edit'
  page?: number
  per_page?: number
  search?: string
  exclude?: string
  include?: string
  order?: 'asc' | 'desc'
  orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count'
  hide_empty?: boolean
  parent?: number
  post?: number
  slug?: string
}

export interface Category {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  cover_image: string
}
