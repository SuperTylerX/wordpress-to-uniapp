import { postJSON } from '@/api/utils'
import { PLUGIN_REST_API_URL } from '@/config'
import type { ResponseObj } from '@/types/http'

export const getGraphicCaptcha = ({
  email,
  graphicCaptcha,
  token
}: {
  email?: string
  graphicCaptcha?: string
  token?: string
}) =>
  postJSON<{ image: string; token: string }>(`${PLUGIN_REST_API_URL}/register/getGraphicCaptcha`, {
    email,
    graphicCaptcha,
    token
  })

export const getEmailCaptcha = ({
  email,
  graphicCaptcha,
  token
}: {
  email: string
  graphicCaptcha: string
  token: string
}) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/register/getEmailCaptcha`, {
    email,
    graphicCaptcha,
    token
  })

export const updateUserEmail = ({
  email,
  graphicCaptcha,
  emailCaptcha,
  token
}: {
  email: string
  graphicCaptcha: string
  emailCaptcha: string
  token: string
}) =>
  postJSON<ResponseObj<AnyObject>>(`${PLUGIN_REST_API_URL}/register/updateEmail`, {
    email,
    graphicCaptcha,
    emailCaptcha,
    token
  })

export const uploadAvatar = (avatar: string) =>
  postJSON<ResponseObj<{ avatarUrl: string }>>(`${PLUGIN_REST_API_URL}/register/uploadAvatar`, {
    avatar
  })
export const userRegister = ({
  nickname,
  email,
  password,
  graphicCaptcha,
  emailCaptcha,
  token
}: {
  nickname: string
  email: string
  password: string
  graphicCaptcha: string
  emailCaptcha: string
  token: string
}) =>
  postJSON<ResponseObj<null>>(`${PLUGIN_REST_API_URL}/register/submit`, {
    nickname,
    email,
    password,
    graphicCaptcha,
    emailCaptcha,
    token
  })

export const userResetPassword = ({
  email,
  password,
  graphicCaptcha,
  emailCaptcha,
  token
}: {
  email: string
  password: string
  graphicCaptcha: string
  emailCaptcha: string
  token: string
}) =>
  postJSON<ResponseObj<null>>(`${PLUGIN_REST_API_URL}/register/reset`, {
    email,
    password,
    graphicCaptcha,
    emailCaptcha,
    token
  })
