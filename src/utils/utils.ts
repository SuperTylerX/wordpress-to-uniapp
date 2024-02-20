export const decodeJwt = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload) as {
    iss: string
    iat: number
    nbf: number
    exp: number
  }
}

type RedirectType = 'apppage' | 'webpage'
export const redirect = <T extends RedirectType>(
  option: T extends 'apppage'
    ? {
        type: 'apppage'
        path: string
      }
    : {
        type: 'webpage'
        url: string
      }
) => {
  switch (option.type) {
    case 'apppage':
      uni.navigateTo({
        url: option.path
      })
      break
    case 'webpage':
      uni.navigateTo({
        url: '/pages/webpage/webpage' + '?url=' + option.url
      })
      break
  }
}

export const getPlatform = () => {
  // #ifdef APP-PLUS || APP-PLUS-NVUE || APP-NVUE
  return 'APP'
  // #endif

  // #ifdef H5
  return 'H5'
  // #endif

  // #ifdef MP-WEIXIN
  return 'MP-WEIXIN'
  // #endif

  // #ifdef MP-ALIPAY
  return 'MP-ALIPAY'
  // #endif

  // #ifdef MP-BAIDU
  return 'MP-BAIDU'
  // #endif

  // #ifdef MP-QQ
  return 'MP-QQ'
  // #endif

  // #ifdef MP-TOUTIAO
  return 'MP-TOUTIAO'
  // #endif

  // #ifdef MP-LARK
  return 'MP-LARK'
  // #endif

  // #ifdef MP-KUAISHOU
  return 'MP-KUAISHOU'
  // #endif

  // #ifdef MP-JD
  return 'MP-JD'
  // #endif

  // #ifdef MP-360
  return 'MP-360'
  // #endif

  // #ifdef QUICKAPP-WEBVIEW || QUICKAPP-WEBVIEW-UNION || QUICKAPP-WEBVIEW-HUAWEI
  return 'QUICKAPP'
  // #endif
}
