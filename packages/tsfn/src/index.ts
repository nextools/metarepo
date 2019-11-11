export type TAnyObject = {
  [key: string]: any,
}
export type TKeyOf<T> = (keyof T) & string
export type TIntersect <T1 extends {}, T2 extends {}> = { [K in Extract<keyof T1, keyof T2>]: T1[K] }
export type TRequireKeys<T, K extends keyof T> = T & {
  [P in Extract<keyof T, K>]: Exclude<T[P], undefined>;
}
export type TOptionalKeys<T extends {}> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>
export type TRequiredKeys<T extends {}> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? K
    : never
}[keyof T], undefined>
export type TWritable<T> = { -readonly [K in keyof T]: T[K] };
export type TOmitKey<T extends {}, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>

export const getObjectKeys = <T extends {}> (obj: T) => Object.keys(obj) as (keyof T)[]
export const getObjectValues = <T extends {}> (obj: T): T[keyof T][] => Object.values(obj)
export const getObjectEntries = <T extends {}> (obj: T) => Object.entries(obj) as unknown as [keyof T, T[keyof T]][]

export const objectHas = <T extends {}, K extends keyof T> (obj: T, key: K): obj is T & { [k in K]-?: T[k] } => Reflect.has(obj, key)

export const EMPTY_OBJECT = Object.freeze(Object.create(null)) as any
export const EMPTY_ARRAY = [] as any
export const UNDEFINED = void 0
export const NOOP = () => {}

export const isUndefined = (value: any): value is undefined => value === UNDEFINED
export const isDefined = <T>(value: T): value is T extends undefined ? never : T => value !== UNDEFINED
export const isNull = (value: any): value is null => value === null
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isNumber = (value: any): value is number => typeof value === 'number' && isFinite(value)
export const isString = (value: any): value is string => typeof value === 'string'
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isArray = (value: any): value is any[] => Array.isArray(value)
export const isObject = (value: any): value is TAnyObject => Object.prototype.toString.call(value) === '[object Object]'
export const isSymbol = (value: any): value is symbol => typeof value === 'symbol'
export const isRegExp = (value: any): value is RegExp => Object.prototype.toString.call(value) === '[object RegExp]'

export const requestAnimationFrame = (global as any as Window).requestAnimationFrame || global.setImmediate
export const cancelAnimationFrame = (global as any as Window).cancelAnimationFrame || global.clearImmediate

export * from './extend'
