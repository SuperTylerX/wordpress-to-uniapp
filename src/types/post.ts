export interface GetPostListParams {
  context?: 'view' | 'embed' | 'edit'
  page?: number
  per_page?: number
  search?: string
  after?: string
  modified_after?: string
  author?: number
  author_exclude?: number
  before?: string
  modified_before?: string
  exclude?: number
  include?: number
  offset?: number
  order?: 'asc' | 'desc'
  orderby?:
    | 'author'
    | 'date'
    | 'id'
    | 'include'
    | 'modified'
    | 'parent'
    | 'relevance'
    | 'slug'
    | 'include_slugs'
    | 'title'
  search_columns?: string[]
  slug?: string
  status?: string
  tax_relation?: 'AND' | 'OR'
  categories?: number
  categories_exclude?: number
  tags?: string
  tags_exclude?: number
  sticky?: boolean
}

export interface Post {
  id: number
  date: string
  date_gmt: string
  guid: GUID
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: GUID
  content: Content
  excerpt: Content
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: Meta
  categories: number[]
  tags: string[]
  post_first_image: string
  post_thumbnail_image: string
  post_medium_image: string
  post_large_image: string
  post_full_image: string
  post_all_images: string[]
  category_name: string
  post_date: string
  like_count: number
  total_comments: number
  avatarurls: Avatarurl[]
  next_post_id: number
  next_post_title: string
  previous_post_id: number
  previous_post_title: string
  pageviews: number
}

export interface Avatarurl {
  avatarurl: string
}

export interface Content {
  rendered: string
  protected: boolean
}

export interface GUID {
  rendered: string
}

export interface Meta {
  _bbp_topic_count: number
  _bbp_reply_count: number
  _bbp_total_topic_count: number
  _bbp_total_reply_count: number
  _bbp_voice_count: number
  _bbp_anonymous_reply_count: number
  _bbp_topic_count_hidden: number
  _bbp_reply_count_hidden: number
  _bbp_forum_subforum_count: number
  footnotes: string
}

export interface HistoryPostItem {
  id: number
  post_medium_image: string
  title: GUID
  date: string
  total_comments: number
  like_count: number
  pageviews: number
}
