// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any

export type Arrayable<T> = T | T[]

export interface AnyFn {
  (...args: AnyType): AnyType
  [key: keyof AnyType]: AnyType
}

export type UnReadonly<T> = {
  -readonly [P in keyof T]: T[P]
}

/** 交叉类型转接口类型 */
export type IntersectionToInterface<I> = Omit<I, never>

export type Merge<A, B> = IntersectionToInterface<Omit<A, keyof B> & B>

export type ArrayItemType<T> = T extends Array<infer U> ? U : never

export type ExcludeEmptyString<T> = T extends '' ? never : T

export type WithoutEmptyString<U> = {
  [K in keyof U]: ExcludeEmptyString<U[K]> extends never ? never : ExcludeEmptyString<U[K]>
}
