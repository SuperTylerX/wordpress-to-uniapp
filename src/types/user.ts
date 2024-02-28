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
}

export interface SocialConnect {
  qq: string
  wechat: string
  baidu: string
  bytedance: string
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
