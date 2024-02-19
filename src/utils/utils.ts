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
