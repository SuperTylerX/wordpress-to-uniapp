export interface ForumCategory {
  order: number
  id: number
  name: string
  parent: number
  content: string
}

export interface Forum {
  id: number
  title: string
  name: string
  parent: number
  total: number
  content: string
  page: string
  per_page: string
  stickies: Topic[]
  super_stickies: Topic[]
  total_topics: number
  total_pages: number
  topics: Topic[]
}

export interface Topic {
  id: number
  title: string
  reply_count: number
  permalink: string
  author_id: number
  author_name: string
  author_avatar: string
  views: number
  post_date: string
  excerpt: string
  all_img: string[]
  like_count: number
  is_user_favorite: boolean
}

export interface TopicDetail {
  id: number
  title: string
  reply_count: number
  permalink: string
  author_name: string
  author_id: number
  author_avatar: string
  post_date: string
  is_sticky: boolean
  is_super_sticky: boolean
  status: string
  is_comment_enabled: boolean
  views: number
  content: string
  like_count: number
  is_user_favorite: boolean
  all_img: string[]
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
}
