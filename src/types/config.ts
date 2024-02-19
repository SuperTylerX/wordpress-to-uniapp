export interface Config {
  downloadfileDomain: string
  businessDomain: string
  posterImageUrl: string
  zanImageUrl: string
  logoImageUrl: boolean
  shareImageUrl: string
  expand: Expand
  wf_enable_comment_option: string
  wf_enable_qq_comment_option: string
  uni_enable_bytedance_comment_option: boolean
  uni_enable_baidu_comment_option: boolean
  uni_enable_h5_comment_option: boolean
  wf_weixin_enterprise_minapp: string
  wf_qq_enterprise_minapp: string
  interstitialAdId: string
  enable_index_interstitial_ad: string
  enable_detail_interstitial_ad: string
  enable_topic_interstitial_ad: string
  enable_list_interstitial_ad: string
  enable_hot_interstitial_ad: string
  enable_comments_interstitial_ad: string
  enable_live_interstitial_ad: string
  is_user_registration_enable: boolean
}

export interface Expand {
  swipe_nav: Nav[]
  selected_nav: Nav[]
}

export interface Nav {
  type: 'apppage' | 'webpage'
  appid: string
  image: string
  path: string
  url: string
  title: string
}
