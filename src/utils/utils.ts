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
      return uni.navigateTo({
        url: option.path
      })
    case 'webpage':
      return uni.navigateTo({
        url: '/pages/webpage/webpage' + '?url=' + option.url
      })
  }
}

export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

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

/**
 * 图片转base64，基于uni.arrayBufferToBase64，转换网络图片为base64
 * 兼容：APP、H5、微信小程序、快手小程序、京东小程序、支付宝小程序
 * 缺点：小程序端不支持转换本地图片
 * */
export const imgToBase64Fn1 = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    uni.request({
      url,
      responseType: 'arraybuffer',
      success: res => {
        resolve(
          `data:image/${url.split('.').pop()};base64,${uni.arrayBufferToBase64(res.data as ArrayBuffer)}`
        )
      },
      fail: reject
    })
  })
}

/**
 * 图片转base64，基于uni.getFileSystemManager
 * 兼容：微信小程序、QQ小程序、字节小程序、百度小程序、支付宝小程序
 * 缺点：只支持小程序端
 * */

export const imgToBase64Fn2 = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath: url,
      encoding: 'base64',
      success: res => {
        resolve(`data:image/${url.split('.').pop()};base64,${res.data}`)
      },
      fail: reject
    })
  })
}

/**
 * 图片转base64, App转换本地图片方案
 * @param url
 */
export const imgToBase64Fn3 = async (url: string) =>
  new Promise<string>((resolve, reject) => {
    plus.io.resolveLocalFileSystemURL(
      url,
      entry => {
        // @ts-expect-error 无法找到plus-io的类型定义
        entry.file(
          // @ts-expect-error 无法找到plus-io的类型定义
          file => {
            const fileReader = new plus.io.FileReader()
            fileReader.onload = evt => {
              // @ts-expect-error 无法找到plus-io的类型定义
              resolve(evt.target?.result)
            }
            fileReader.onerror = function (error) {
              reject(error)
            }
            fileReader.readAsDataURL(file)
          },
          // @ts-expect-error 无法找到plus-io的类型定义
          error => {
            reject(error)
          }
        )
      },
      function (error) {
        reject(error)
      }
    )
  })

export const localImgToBase64 = async (url: string) => {
  if (['APP'].includes(getPlatform())) {
    // APP使用Fn3
    return imgToBase64Fn3(url)
  } else if (['H5'].includes(getPlatform())) {
    // H5使用Fn1
    return imgToBase64Fn1(url)
  } else {
    // QQ小程序、字节小程序、微信小程序、快手小程序、京东小程序、支付宝小程序使用Fn2
    return imgToBase64Fn2(url)
  }
}
