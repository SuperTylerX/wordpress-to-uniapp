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
  social_connect: boolean
  role: string
}

export interface miniAppLoginArgs {
  avatarUrl: string
  js_code: string
  nickname: string
}

export interface GetMiniAppUserToken {
  token: string
  openid: string
  unionid: string
}
