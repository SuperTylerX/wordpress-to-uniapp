import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  baiduMiniAppLoginHttp,
  getUserInfo,
  login as httpLogin,
  qqAppLoginHttp,
  qqMiniAppLoginHttp,
  qqWebLoginHttp,
  wxMiniAppLoginHttp
} from '@/api/user'
import type { GetTokenResponse, User } from '@/types/user'
import type { ResponseObj } from '@/types/http'
import { DEFAULT_AVATAR_URL } from '@/config'
// import { decodeJwt } from '@/utils'

export const useUserStore = defineStore(
  'user',
  () => {
    // Token
    const token = ref('')

    const tokenExpire = ref<Date>(new Date())

    // 从token中解析用户信息
    // const decodeUserInfo = () => {
    //   const payload = decodeJwt(token.value)
    //   // 设置token过期时间
    //   tokenExpire.value = new Date(payload.exp * 1000)
    // }

    const login = async (username: string, password: string) => {
      const res = await httpLogin(username, password)
      if (res.statusCode === 200) {
        // 密码正确，设置token
        const { token: _token } = res.data as GetTokenResponse
        token.value = _token
        // decodeUserInfo()
      } else {
        throw res.data as ResponseObj<AnyObject>
      }
    }

    const userInfoModel: User = {
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
      // decodeUserInfo()
    }

    // QQ小程序登录
    const qqMiniAppLogin = async (js_code: string, nickName: string, avatarUrl: string) => {
      const res = await qqMiniAppLoginHttp({
        js_code,
        nickname: nickName,
        avatarUrl: avatarUrl
      })
      token.value = res.token
      // decodeUserInfo()
    }

    // QQ App登录
    const qqAppLogin = async (access_token: string, nickName: string, avatarUrl: string) => {
      const res = await qqAppLoginHttp({
        access_token,
        nickname: nickName,
        avatarUrl
      })
      token.value = res.token
    }

    // QQ Web登录
    const qqWebLogin = async (access_token: string) => {
      const res = await qqWebLoginHttp({
        access_token
      })
      token.value = res.token
    }

    // 百度小程序登录
    const baiduMiniAppLogin = async (js_code: string, nickName: string, avatarUrl: string) => {
      const res = await baiduMiniAppLoginHttp({
        js_code,
        nickname: nickName,
        avatarUrl
      })
      token.value = res.token
    }

    // 重置Store
    const resetStore = () => {
      token.value = ''
      Object.assign(userInfo, userInfoModel)
    }

    return {
      token,
      tokenExpire,
      login,
      userInfo,
      getUserMetaInfo,
      wxMiniAppLogin,
      qqMiniAppLogin,
      qqAppLogin,
      qqWebLogin,
      baiduMiniAppLogin,
      resetStore
    }
  },
  {
    // @ts-expect-error 增加持久化
    unistorage: true
  }
)
