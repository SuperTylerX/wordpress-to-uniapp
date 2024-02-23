import { PLUGIN_REST_API_URL } from '@/config'
import { deleteJSON, get, postJSON } from '@/api/utils'
import type {
  Comment,
  CommentListItem,
  GetCommentListByUserIdParams,
  GetCommentListParams,
  PostMyCommentParams
} from '@/types/comment'
import type { ResponseObj } from '@/types/http'

/**
 * @description 获取某篇文章的评论列表
 * @param params
 */
export const getCommentList = (params: GetCommentListParams) =>
  get<ResponseObj<Comment[]>>(`${PLUGIN_REST_API_URL}/comment/getcomments`, params)

/**
 * @description 发表评论
 * @param params
 */
export const postMyComment = (params: PostMyCommentParams) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/comment/add`, params)

/**
 * @description 删除评论
 */
export const deleteMyComment = (commentId: number) =>
  deleteJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/comment/delete`, { commentId })

/**
 * @description 获取某个用户的评论列表
 */
export const getCommentListByUserId = (params: GetCommentListByUserIdParams) =>
  get<ResponseObj<CommentListItem[]>>(`${PLUGIN_REST_API_URL}/comment/get`, params)
