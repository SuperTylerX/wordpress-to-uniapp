import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfo, login as httpLogin, wxMiniAppLoginHttp } from '@/api/user'
import type { GetTokenResponse, User } from '@/types/user'
import type { ResponseObj } from '@/types/http'
import { DEFAULT_AVATAR_URL } from '@/config'

export const useUserStore = defineStore(
  'user',
  () => {
    // Token
    const token = ref('')

    const login = async (username: string, password: string) => {
      const res = await httpLogin(username, password)
      if (res.statusCode === 200) {
        // 密码正确，设置token
        const { token: _token } = res.data as GetTokenResponse
        token.value = _token
      } else {
        throw res.data as ResponseObj
      }
    }

    const userInfoModel = {
      id: 0,
      username: '',
      name: '',
      first_name: '',
      last_name: '',
      email: '',
      url: '',
      description: '',
      link: '',
      locale: '',
      nickname: '',
      slug: '',
      roles: [],
      registered_date: '',
      avatar: '',
      social_connect: false,
      role: ''
    }

    // 用户信息
    const userInfo = reactive<User>({ ...userInfoModel })
    const getUserMetaInfo = async () => {
      const res = await getUserInfo()
      Object.assign(userInfo, res)
      return res
    }

    // 微信小程序登录
    const wxMiniAppLogin = async (js_code: string) => {
      const res = await wxMiniAppLoginHttp({
        js_code,
        nickname: '微信用户',
        avatarUrl: DEFAULT_AVATAR_URL
      })
      token.value = res.token
    }

    // 重置Store
    const resetStore = () => {
      token.value = ''
      Object.assign(userInfo, userInfoModel)
    }

    return { token, login, userInfo, getUserMetaInfo, wxMiniAppLogin, resetStore }
  },
  {
    // @ts-expect-error 增加持久化
    unistorage: true
  }
)
