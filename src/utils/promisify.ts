// Promisify 工具

import type { AnyFn } from '@/types/typescript'

export function promisify<RequestType, SuccessReturnType>(fn: AnyFn) {
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

// #ifdef MP-BAIDU
export const getLoginCode = promisify<UniNamespace.LoginOptions, UniNamespace.LoginRes>(
  // @ts-expect-error 无法找到swan的类型定义
  swan.getLoginCode
)
// #endif
