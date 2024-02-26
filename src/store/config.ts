import { defineStore } from 'pinia'
import { getHomeConfig } from '@/api/setting'
import { computed, reactive } from 'vue'
import type { Config } from '@/types/config'
import { getPlatform } from '@/utils'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = reactive<Config>({
      downloadfileDomain: '',
      businessDomain: '',
      posterImageUrl: '',
      zanImageUrl: '',
      logoImageUrl: false,
      shareImageUrl: '',
      expand: {
        swipe_nav: [],
        selected_nav: []
      },
      wf_enable_comment_option: '',
      wf_enable_qq_comment_option: '',
      uni_enable_bytedance_comment_option: false,
      uni_enable_baidu_comment_option: false,
      uni_enable_h5_comment_option: false,
      wf_weixin_enterprise_minapp: '',
      wf_qq_enterprise_minapp: '',
      interstitialAdId: '',
      enable_index_interstitial_ad: '',
      enable_detail_interstitial_ad: '',
      enable_topic_interstitial_ad: '',
      enable_list_interstitial_ad: '',
      enable_hot_interstitial_ad: '',
      enable_comments_interstitial_ad: '',
      enable_live_interstitial_ad: '',
      is_user_registration_enable: false
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
          return config.wf_enable_comment_option === '1'
        case 'MP-QQ':
          return config.wf_enable_qq_comment_option === '1'
        case 'MP-BAIDU':
          return config.uni_enable_baidu_comment_option
        case 'MP-TOUTIAO':
          return config.uni_enable_bytedance_comment_option
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
    // @ts-expect-error 增加持久化
    unistorage: true
  }
)
