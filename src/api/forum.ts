import { get, postJSON } from '@/api/utils'
import { PLUGIN_REST_API_URL } from '@/config'
import type { Forum, ForumCategory, TopicDetail } from '@/types/forum'
import type { ResponseObj } from '@/types/http'
import type { Comment } from '@/types/comment'

export const getForumCategories = () => get<ForumCategory[]>(`${PLUGIN_REST_API_URL}/forums`)

export const getForumTopicList = ({
  id,
  page,
  per_page
}: {
  id: number
  page: number
  per_page: number
}) => get<Forum>(`${PLUGIN_REST_API_URL}/forums/${id}`, { page, per_page })

export const forumPostLike = ({ id, isLike }: { id: number; isLike: boolean }) =>
  postJSON(`${PLUGIN_REST_API_URL}/forums/like`, { id, isLike })

export const getForumTopicDetail = (id: number) =>
  get<TopicDetail>(`${PLUGIN_REST_API_URL}/forums/topic/${id}`)

export const getForumTopicComment = ({
  id,
  page,
  per_page,
  order
}: {
  id: number
  page: number
  per_page: number
  order: 'asc' | 'desc'
}) => get<Comment[]>(`${PLUGIN_REST_API_URL}/forums/reply/${id}`, { page, per_page, order })

export const postForumReply = ({
  topic_id,
  reply_to_id,
  content,
  platform
}: {
  topic_id: number
  reply_to_id: number
  content: string
  platform: string
}) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/forums/reply`, {
    topic_id,
    reply_to_id,
    content,
    platform
  })

export const postForumPost = ({
  forum_id,
  content,
  tags,
  images,
  platform
}: {
  forum_id: number
  content: string
  tags: string[]
  images: string[]
  platform: string
}) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/forums/topic`, {
    forum_id,
    content,
    tags,
    images,
    platform
  })
