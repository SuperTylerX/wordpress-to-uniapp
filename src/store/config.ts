import { defineStore } from 'pinia'
import { getHomeConfig } from '@/api/setting'
import { computed, reactive } from 'vue'
import type { Config } from '@/types/config'
import { getPlatform } from '@/utils'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = reactive<Config>({
      logoImageUrl: '',
      shareImageUrl: '',
      blogDescription: '',
      expand: {
        swipe_nav: [],
        selected_nav: []
      },
      uni_enable_weixin_comment_option: false,
      uni_enable_qq_comment_option: false,
      uni_enable_bytedance_comment_option: false,
      uni_enable_baidu_comment_option: false,
      uni_enable_h5_comment_option: false,
      uni_enable_alipay_comment_option: false,
      uni_weixin_enterprise_minapp: false,
      uni_qq_enterprise_minapp: false,
      is_user_registration_enable: false,
      uni_h5_qq_client_id: '',
      uni_h5_qq_callback_url: '',
      uni_enable_weixin_push: false,
      uni_weixin_comment_template_id: '',
      uni_weixin_comment_reply_template_id: ''
    })

    const getConfig = async () => {
      const res = await getHomeConfig()
      Object.assign(config, res)
      return res
    }

    const isCommentEnabled = computed(() => {
      const platform = getPlatform()
      switch (platform) {
        case 'MP-WEIXIN':
          return config.uni_enable_weixin_comment_option
        case 'MP-QQ':
          return config.uni_enable_qq_comment_option
        case 'MP-BAIDU':
          return config.uni_enable_baidu_comment_option
        case 'MP-TOUTIAO':
          return config.uni_enable_bytedance_comment_option
        case 'MP-ALIPAY':
          return config.uni_enable_alipay_comment_option
        case 'H5':
          return config.uni_enable_h5_comment_option
        default:
          return true
      }
    })

    return {
      config,
      getConfig,
      isCommentEnabled
    }
  },
  {
    unistorage: true
  }
)
