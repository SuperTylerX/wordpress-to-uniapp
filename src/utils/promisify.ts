// Promisify 工具

// eslint-disable-next-line @typescript-eslint/ban-types
export function promisify<RequestType, SuccessReturnType>(fn: Function) {
  return function (args: RequestType) {
    return new Promise<SuccessReturnType>((resolve, reject) => {
      fn({
        ...args,
        success: resolve,
        fail: reject
      })
    })
  }
}

type RequestSuccessCallbackResult = UniNamespace.RequestSuccessCallbackResult
type RequestOptions = UniNamespace.RequestOptions

export const request = promisify<RequestOptions, RequestSuccessCallbackResult>(uni.request)
export const scanCode = promisify<UniNamespace.ScanCodeOptions, UniNamespace.ScanCodeSuccessRes>(
  uni.scanCode
)
export const login = promisify<UniNamespace.LoginOptions, UniNamespace.LoginRes>(uni.login)
