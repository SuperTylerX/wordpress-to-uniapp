import { PLUGIN_REST_API_URL } from '@/config'
import { get, postJSON } from '@/api/utils'
import type { GetPostListParams, Post } from '@/types/post'
import type { ResponseObj } from '@/types/http'

export const getPostList = (params: GetPostListParams) =>
  get<Post[] | ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/posts`, params)

export const getPostDetail = (id: number) => get<Post>(`${PLUGIN_REST_API_URL}/posts/${id}`)

export const postLike = (postid: number) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/post/like`, { postid })
