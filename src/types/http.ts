export interface ResponseObj<T> {
  code: number | string
  data: T
  message: string
}

export interface ResponseStructure<T> {
  cookies: string[]
  data: T
  errMsg: string
  header: object
  statusCode: number
}
