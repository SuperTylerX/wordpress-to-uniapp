import { PLUGIN_REST_API_URL, WORDPRESS_REST_API_URL } from '@/config'
import { get, postJSON } from '@/api/utils'
import type { GetPostListParams, Post } from '@/types/post'
import type { ResponseObj } from '@/types/http'

export const getPostList = (params: GetPostListParams) =>
  get<Post[] | ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/posts`, params)

export const getPost = (id: number) => get<Post>(`${PLUGIN_REST_API_URL}/posts/${id}`)

export const getPage = (id: number) => get<Post>(`${WORDPRESS_REST_API_URL}/pages/${id}`)

export const postLike = (postid: number) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/post/like`, { postid })

/** 获取我收藏的文章 */
export const getMyFavoritePosts = () =>
  postJSON<ResponseObj<Post[]>>(`${PLUGIN_REST_API_URL}/post/mylike`)

/** 获取评论热门文章 */
export const getHotCommentPosts = () =>
  get<Post[]>(`${PLUGIN_REST_API_URL}/post/getTopCommentPosts`)

/** 获取浏览热门文章 */
export const getHotViewPosts = () => get<Post[]>(`${PLUGIN_REST_API_URL}/post/getTopPageViewPosts`)

/** 获取点赞热门 */
export const getHotLikePosts = () => get<Post[]>(`${PLUGIN_REST_API_URL}/post/getTopLikePosts`)
