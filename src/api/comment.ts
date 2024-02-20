import { PLUGIN_REST_API_URL } from '@/config'
import { get, postJSON } from '@/api/utils'
import type { Comment, GetCommentListParams, PostMyCommentParams } from '@/types/comment'
import type { ResponseObj } from '@/types/http'

export const getCommentList = (params: GetCommentListParams) =>
  get<ResponseObj<Comment[]>>(`${PLUGIN_REST_API_URL}/comment/getcomments`, params)

export const postMyComment = (params: PostMyCommentParams) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/comment/postcomment`, params)
