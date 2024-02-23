export interface GetCommentListParams {
  postid: number
  limit: number
  page: number
  order: 'asc' | 'desc'
}

export interface PostMyCommentParams {
  post: number //评论ID
  parent: number //父评论ID
  content: string // 评论内容
  platform: string
}

export interface Comment {
  id: string
  author_name: string
  author_url: string
  date: string
  content: string
  userid: string
  location?: Location
  child: Comment[]
}

export interface Location {
  country_name: string
  region_name: string
  city_name: string
}

export interface CommentListItem {
  post: number
  id: number
  post_title: string
  comment_content: string
  date: string
  author_name: string
  author_avatar: string
}

export interface GetCommentListByUserIdParams {
  userId: number
  limit: number
  page: number
  order: 'asc' | 'desc'
}
