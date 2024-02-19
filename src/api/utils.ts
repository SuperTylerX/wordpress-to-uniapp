import { request } from '@/utils'
import type { ResponseObj } from '@/types/http'
import { merge } from 'lodash-es'
import { useUserStore } from '@/store/user'

type RequestOptions = UniNamespace.RequestOptions

const isHttpSuccess = (status: number) => (status >= 200 && status < 300) || status === 304

export interface ExtraRequestOptions {
  isHandleError?: boolean
  useToken?: boolean
}

const defaultExtraOptions: ExtraRequestOptions = {
  isHandleError: true,
  useToken: true
}

export const http = async <T>(options: RequestOptions, extraOptions?: ExtraRequestOptions) =>
  new Promise<T>((resolve, reject) => {
    const { isHandleError, useToken } = { ...defaultExtraOptions, ...extraOptions }

    if (useToken) {
      const userStore = useUserStore()

      const token = userStore.token

      // 如果token有值，添加到header上
      if (token) {
        merge(options, {
          header: {
            Authorization: 'Bearer ' + token
          }
        })
      }
    }

    request(options)
      .then(res => {
        if (isHandleError) {
          if (isHttpSuccess(res.statusCode)) {
            resolve(res.data as T)
          } else {
            uni.showToast({
              title: (res.data as ResponseObj).message,
              icon: 'none'
            })
            reject(res)
          }
        } else {
          resolve(res as T)
        }
      })
      .catch(err => {
        uni.showToast({
          title: '请检查网络连接',
          icon: 'error'
        })
        reject(err)
      })
  })

export const get = <T>(
  url: string,
  data?: AnyObject,
  options?: Omit<RequestOptions, 'url'>,
  extraOptions?: ExtraRequestOptions
) =>
  http<T>(
    {
      url,
      data,
      method: 'GET',
      ...options
    },
    extraOptions
  )
export const postJSON = <T>(
  url: string,
  data?: AnyObject,
  options?: Omit<RequestOptions, 'url'>,
  extraOptions?: ExtraRequestOptions
) =>
  http<T>(
    {
      url,
      data,
      method: 'POST',
      dataType: 'json',
      ...options
    },
    extraOptions
  )
