export interface ResponseObj {
  code: number | string
  data: any // eslint-disable-line
  message: string
}

export interface ResponseStructure<T> {
  cookies: string[]
  data: T
  errMsg: string
  header: object
  statusCode: number
}
