import { get, postJSON } from '@/api/utils'
import { JWT_REST_API_URL, PLUGIN_REST_API_URL, WORDPRESS_REST_API_URL } from '@/config'
import type {
  GetMiniAppUserToken,
  GetTokenResponse,
  miniAppLoginArgs,
  qqAppLoginArgs,
  qqWebLoginArgs,
  User,
  UserProfile
} from '@/types/user'
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

export const updateUserInfo = (userInfo: Partial<User>) =>
  postJSON<User>(`${WORDPRESS_REST_API_URL}/users/me`, userInfo)

export const wxMiniAppLoginHttp = (loginOption: miniAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/weixin/miniAppLogin`, loginOption)

export const qqMiniAppLoginHttp = (loginOption: miniAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/qq/appLogin`, loginOption)

export const qqAppLoginHttp = (loginOption: qqAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/qq/appLogin`, loginOption)

export const qqWebLoginHttp = (loginOption: qqWebLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/qq/h5Login`, loginOption)

export const baiduMiniAppLoginHttp = (loginOption: miniAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/baidu/miniAppLogin`, loginOption)

export const bytedanceMiniAppLoginHttp = (loginOption: miniAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/bytedance/miniAppLogin`, loginOption)

export const alipayMiniAppLoginHttp = (loginOption: miniAppLoginArgs) =>
  postJSON<GetMiniAppUserToken>(`${PLUGIN_REST_API_URL}/alipay/miniAppLogin`, loginOption)

export const getQRInfo = (token: string) =>
  postJSON<{ expire_time: number; status: number }>(`${PLUGIN_REST_API_URL}/login/getQRInfo`, {
    token
  })

export const confirmQRLogin = (token: string, isContinue: boolean) =>
  postJSON<null>(`${PLUGIN_REST_API_URL}/login/confirmLogin`, {
    token,
    isContinue
  })

export const getWebsiteUserProfile = (userId: number) =>
  get<UserProfile>(`${PLUGIN_REST_API_URL}/profile/getUserProfile`, { userId })
