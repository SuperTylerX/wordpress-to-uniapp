import { PLUGIN_REST_API_URL, WORDPRESS_REST_API_URL } from '@/config'
import { get, postJSON } from '@/api/utils'
import type { GetPostListParams, Post, PostData } from '@/types/post'
import type { ResponseObj } from '@/types/http'

/** 获取文章列表 */
export const getPostList = (params: GetPostListParams) =>
  get<Post[] | ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/posts`, params)

/** 获取文章详情 */
export const getPost = (id: number) => get<Post>(`${PLUGIN_REST_API_URL}/posts/${id}`)

/** 获取页面详情 */
export const getPage = (id: number) => get<Post>(`${WORDPRESS_REST_API_URL}/pages/${id}`)

/** 发表文章 */
export const createPost = (data: PostData) =>
  postJSON<ResponseObj<Post>>(`${WORDPRESS_REST_API_URL}/posts`, data)

/** 更新文章 */
export const updatePost = (data: PostData) =>
  postJSON<ResponseObj<Post>>(`${WORDPRESS_REST_API_URL}/posts/${data.id}`, data)

/** 给文章点赞 */
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
