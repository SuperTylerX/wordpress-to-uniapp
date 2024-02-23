import type { Post } from '@/types/post'

export const DefaultPost: Post = {
  author: 0,
  categories: [],
  category_name: '',
  date_gmt: '',
  excerpt: {
    rendered: '',
    protected: false
  },
  featured_media: 0,
  format: '',
  guid: {
    rendered: ''
  },
  id: 0,
  like_count: 0,
  link: '',
  modified: '',
  modified_gmt: '',
  next_post_id: 0,
  next_post_title: '',
  pageviews: 0,
  ping_status: '',
  post_all_images: [],
  post_date: '',
  post_first_image: '',
  post_full_image: '',
  post_large_image: '',
  post_medium_image: '',
  post_thumbnail_image: '',
  previous_post_id: 0,
  previous_post_title: '',
  slug: '',
  status: '',
  sticky: false,
  tags: [],
  template: '',
  total_comments: 0,
  type: '',
  title: {
    rendered: ''
  },
  date: '',
  content: {
    rendered: '',
    protected: false
  },
  avatarurls: [],
  comment_status: '',
  meta: {
    _bbp_topic_count: 0,
    _bbp_reply_count: 0,
    _bbp_total_topic_count: 0,
    _bbp_total_reply_count: 0,
    _bbp_voice_count: 0,
    _bbp_anonymous_reply_count: 0,
    _bbp_topic_count_hidden: 0,
    _bbp_reply_count_hidden: 0,
    _bbp_forum_subforum_count: 0,
    footnotes: ''
  }
}

export enum Platform {
  APP = 'APP',
  H5 = 'H5',
  MP_WEIXIN = 'MP-WEIXIN',
  MP_QQ = 'MP-QQ',
  MP_TOUTIAO = 'MP-TOUTIAO',
  MP_BAIDU = 'MP-BAIDU',
  MP_ALIPAY = 'MP-ALIPAY'
}

export const PlatformLabel = {
  [Platform.APP]: 'APP',
  [Platform.H5]: 'H5',
  [Platform.MP_WEIXIN]: '微信',
  [Platform.MP_QQ]: 'QQ',
  [Platform.MP_TOUTIAO]: '头条',
  [Platform.MP_ALIPAY]: '支付宝',
  [Platform.MP_BAIDU]: '百度'
}
