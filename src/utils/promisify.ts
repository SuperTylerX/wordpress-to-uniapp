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

export const getLoginCode = promisify<UniNamespace.LoginOptions, UniNamespace.LoginRes>(
  // @ts-expect-error 无法找到swan的类型定义
  swan.getLoginCode
)
