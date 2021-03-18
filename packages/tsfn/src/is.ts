import type { Stream } from 'stream'
import { UNDEFINED } from './const'
import type { TAnyObject } from './types'

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
export const isStream = (value: any): value is Stream => isObject(value) && isFunction(value.pipe)
export const isError = <T = Error>(value: any): value is T => value instanceof Error
export const isIterable = (value: any): value is Iterable<any> => isDefined(value) && !isNull(value) && Reflect.has(value, Symbol.iterator)
export const isAsyncIterable = (value: any): value is AsyncIterable<any> => isDefined(value) && !isNull(value) && Reflect.has(value, Symbol.asyncIterator)
