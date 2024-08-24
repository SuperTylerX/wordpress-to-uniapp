export type pushType = 'redirect' | 'unknown'

export type RedirectData = {
  url: string
}

export type PushData<T extends pushType> = {
  type: T
  data: T extends 'redirect' ? RedirectData : unknown
}
