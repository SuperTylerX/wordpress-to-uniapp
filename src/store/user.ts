import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import {
  alipayMiniAppLoginHttp,
  baiduMiniAppLoginHttp,
  bytedanceMiniAppLoginHttp,
  getUserInfo,
  login as httpLogin,
  qqAppLoginHttp,
  qqMiniAppLoginHttp,
  qqWebLoginHttp,
  wxMiniAppLoginHttp
} from '@/api/user'
import { DEFAULT_AVATAR_URL } from '@/config'
import type { ResponseObj } from '@/types/http'
import type { GetTokenResponse, User } from '@/types/user'
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
      role: '',
      capabilities: {
        switch_themes: false,
        edit_themes: false,
        activate_plugins: false,
        edit_plugins: false,
        edit_users: false,
        edit_files: false,
        manage_options: false,
        moderate_comments: false,
        manage_categories: false,
        manage_links: false,
        upload_files: false,
        import: false,
        unfiltered_html: false,
        edit_posts: false,
        edit_others_posts: false,
        edit_published_posts: false,
        publish_posts: false,
        edit_pages: false,
        read: false,
        level_10: false,
        level_9: false,
        level_8: false,
        level_7: false,
        level_6: false,
        level_5: false,
        level_4: false,
        level_3: false,
        level_2: false,
        level_1: false,
        level_0: false,
        edit_others_pages: false,
        edit_published_pages: false,
        publish_pages: false,
        delete_pages: false,
        delete_others_pages: false,
        delete_published_pages: false,
        delete_posts: false,
        delete_others_posts: false,
        delete_published_posts: false,
        delete_private_posts: false,
        edit_private_posts: false,
        read_private_posts: false,
        delete_private_pages: false,
        edit_private_pages: false,
        read_private_pages: false,
        delete_users: false,
        create_users: false,
        unfiltered_upload: false,
        edit_dashboard: false,
        update_plugins: false,
        delete_plugins: false,
        install_plugins: false,
        update_themes: false,
        install_themes: false,
        update_core: false,
        list_users: false,
        remove_users: false,
        promote_users: false,
        edit_theme_options: false,
        delete_themes: false,
        export: false,
        keep_gate: false,
        spectate: false,
        participate: false,
        moderate: false,
        throttle: false,
        view_trash: false,
        assign_moderators: false,
        publish_forums: false,
        edit_forums: false,
        edit_others_forums: false,
        delete_forums: false,
        delete_others_forums: false,
        read_private_forums: false,
        read_hidden_forums: false,
        publish_topics: false,
        edit_topics: false,
        edit_others_topics: false,
        delete_topics: false,
        delete_others_topics: false,
        read_private_topics: false,
        publish_replies: false,
        edit_replies: false,
        edit_others_replies: false,
        delete_replies: false,
        delete_others_replies: false,
        read_private_replies: false,
        manage_topic_tags: false,
        edit_topic_tags: false,
        delete_topic_tags: false,
        assign_topic_tags: false,
        administrator: false,
        bbp_keymaster: false
      }
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

    // 字节跳动小程序登录
    const bytedanceMiniAppLogin = async (js_code: string, nickName: string, avatarUrl: string) => {
      const res = await bytedanceMiniAppLoginHttp({
        js_code,
        nickname: nickName,
        avatarUrl
      })
      token.value = res.token
    }

    // 支付宝小程序登录
    const alipayMiniAppLogin = async (js_code: string, nickName: string, avatarUrl: string) => {
      const res = await alipayMiniAppLoginHttp({
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
      bytedanceMiniAppLogin,
      alipayMiniAppLogin,
      resetStore
    }
  },
  {
    unistorage: true
  }
)
