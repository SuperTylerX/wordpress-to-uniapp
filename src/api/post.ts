import { PLUGIN_REST_API_URL } from '@/config'
import { get } from '@/api/utils'
import type { GetPostListParams, Post } from '@/types/post'
import type { ResponseObj } from '@/types/http'

export const getPostList = (params: GetPostListParams) =>
  get<Post[] | ResponseObj>(`${PLUGIN_REST_API_URL}/posts`, params)
