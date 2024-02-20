import { postJSON } from '@/api/utils'
import { JWT_REST_API_URL, PLUGIN_REST_API_URL, WORDPRESS_REST_API_URL } from '@/config'
import type { GetMiniAppUserToken, GetTokenResponse, miniAppLoginArgs, User } from '@/types/user'
import type { ResponseObj, ResponseStructure } from '@/types/http'

export const login = (username: string, password: string) =>
  postJSON<ResponseStructure<GetTokenResponse | ResponseObj<AnyObject>>>(
    `${JWT_REST_API_URL}/token`,
    {
      username,
      password
    },
    {},
    { isHandleError: false }
  )

export const getUserInfo = () => postJSON<User>(`${WORDPRESS_REST_API_URL}/users/me`)

export const wxMiniAppLoginHttp = (loginOption: miniAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/weixin/miniAppLogin`, loginOption)
