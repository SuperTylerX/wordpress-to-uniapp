export interface Config {
  expand: Expand
  logoImageUrl: string
  shareImageUrl: string
  blogDescription: string
  uni_h5_qq_client_id: string
  uni_h5_qq_callback_url: string
  uni_enable_weixin_comment_option: boolean
  uni_enable_qq_comment_option: boolean
  uni_enable_bytedance_comment_option: boolean
  uni_enable_baidu_comment_option: boolean
  uni_enable_alipay_comment_option: boolean
  uni_enable_h5_comment_option: boolean
  uni_weixin_enterprise_minapp: boolean
  uni_qq_enterprise_minapp: boolean
  is_user_registration_enable: boolean
  uni_enable_weixin_push: boolean
  uni_weixin_comment_template_id: string
  uni_weixin_comment_reply_template_id: string
  uni_qq_comment_template_id: string
  uni_qq_comment_reply_template_id: string
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

export interface AppUpdatedVersion {
  updatedVersion: string
  updatedVersionCode: number
  downloadLink: string
  iosDownloadLink: string
  isForceUpdate: boolean
  updateLog: string
}
