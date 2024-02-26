import type { ResponseObj } from '@/types/http'
import { merge } from 'lodash-es'
import { useUserStore } from '@/store/user'

type RequestOptions = UniNamespace.RequestOptions
type UploadFileOption = UniNamespace.UploadFileOption

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

    uni
      .request(options)
      .then(res => {
        if (isHandleError) {
          if (isHttpSuccess(res.statusCode)) {
            resolve(res.data as T)
          } else {
            // 判断是否是Token过期或者是错误
            if ((res.data as ResponseObj<AnyObject>).code === 'jwt_auth_invalid_token') {
              uni.showToast({
                title: '登录过期，请重新登录',
                icon: 'none'
              })
              // 清除token
              const userStore = useUserStore()
              userStore.resetStore()
              reject(res)
            } else {
              uni.showToast({
                title: (res.data as ResponseObj<AnyObject>).message,
                icon: 'none'
              })
              reject(res)
            }
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

export const httpFileUpload = async <T>(
  options: UploadFileOption,
  extraOptions?: ExtraRequestOptions
) =>
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

    uni
      .uploadFile(options)
      .then(res => {
        if (isHandleError) {
          if (isHttpSuccess(res.statusCode)) {
            try {
              const data = JSON.parse(res.data) as T
              resolve(data)
            } catch (e) {
              uni.showToast({
                title: '响应解析错误',
                icon: 'none'
              })
            }
          } else {
            uni.showToast({
              title: res.data,
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

export const deleteJSON = <T>(
  url: string,
  data?: AnyObject,
  options?: Omit<RequestOptions, 'url'>,
  extraOptions?: ExtraRequestOptions
) =>
  http<T>(
    {
      url,
      data,
      method: 'DELETE',
      dataType: 'json',
      ...options
    },
    extraOptions
  )

export const postUpload = <T>(
  url: string,
  filePath?: string,
  options?: Omit<UploadFileOption, 'url'>,
  extraOptions?: ExtraRequestOptions
) =>
  httpFileUpload<T>(
    {
      url,
      filePath,
      ...options
    },
    extraOptions
  )
