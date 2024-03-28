export interface GetTokenResponse {
  token: string
  user_email: string
  user_nicename: string
  user_display_name: string
}

export interface User {
  id: number
  username: string
  name: string
  first_name: string
  last_name: string
  email: string
  url: string
  description: string
  link: string
  locale: string
  nickname: string
  slug: string
  roles: string[]
  registered_date: string
  avatar: string
  social_connect: SocialConnect | false
  role: string
  capabilities: Capabilities
}

export interface Capabilities {
  switch_themes: boolean
  edit_themes: boolean
  activate_plugins: boolean
  edit_plugins: boolean
  edit_users: boolean
  edit_files: boolean
  manage_options: boolean
  moderate_comments: boolean
  manage_categories: boolean
  manage_links: boolean
  upload_files: boolean
  import: boolean
  unfiltered_html: boolean
  edit_posts: boolean
  edit_others_posts: boolean
  edit_published_posts: boolean
  publish_posts: boolean
  edit_pages: boolean
  read: boolean
  level_10: boolean
  level_9: boolean
  level_8: boolean
  level_7: boolean
  level_6: boolean
  level_5: boolean
  level_4: boolean
  level_3: boolean
  level_2: boolean
  level_1: boolean
  level_0: boolean
  edit_others_pages: boolean
  edit_published_pages: boolean
  publish_pages: boolean
  delete_pages: boolean
  delete_others_pages: boolean
  delete_published_pages: boolean
  delete_posts: boolean
  delete_others_posts: boolean
  delete_published_posts: boolean
  delete_private_posts: boolean
  edit_private_posts: boolean
  read_private_posts: boolean
  delete_private_pages: boolean
  edit_private_pages: boolean
  read_private_pages: boolean
  delete_users: boolean
  create_users: boolean
  unfiltered_upload: boolean
  edit_dashboard: boolean
  update_plugins: boolean
  delete_plugins: boolean
  install_plugins: boolean
  update_themes: boolean
  install_themes: boolean
  update_core: boolean
  list_users: boolean
  remove_users: boolean
  promote_users: boolean
  edit_theme_options: boolean
  delete_themes: boolean
  export: boolean
  keep_gate: boolean
  spectate: boolean
  participate: boolean
  moderate: boolean
  throttle: boolean
  view_trash: boolean
  assign_moderators: boolean
  publish_forums: boolean
  edit_forums: boolean
  edit_others_forums: boolean
  delete_forums: boolean
  delete_others_forums: boolean
  read_private_forums: boolean
  read_hidden_forums: boolean
  publish_topics: boolean
  edit_topics: boolean
  edit_others_topics: boolean
  delete_topics: boolean
  delete_others_topics: boolean
  read_private_topics: boolean
  publish_replies: boolean
  edit_replies: boolean
  edit_others_replies: boolean
  delete_replies: boolean
  delete_others_replies: boolean
  read_private_replies: boolean
  manage_topic_tags: boolean
  edit_topic_tags: boolean
  delete_topic_tags: boolean
  assign_topic_tags: boolean
  administrator: boolean
  bbp_keymaster: boolean
}

export interface SocialConnect {
  qq: string
  wechat: string
  baidu: string
  bytedance: string
  alipay: string
}

export interface miniAppLoginArgs {
  avatarUrl: string
  nickname: string
  js_code: string
}

export interface qqAppLoginArgs {
  avatarUrl: string
  nickname: string
  access_token: string
}

export interface qqWebLoginArgs {
  access_token: string
}

export interface GetMiniAppUserToken {
  token: string
  openid: string
  unionid: string
}

export interface UserProfile {
  nickname: string
  userId: number
  avatarUrl: string
  registered: string
  description: string
  location: Location
  role: string
}

export interface Location {
  country_name: string
  region_name: string
  city_name: string
}
