import { ComponentType, isValidElement } from 'react'

export const isUndefined = (value: any): value is undefined => {
  return value === undefined
}

export const isNull = (value: any): value is null => {
  return value === null
}

export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Boolean]'
}

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]'
}

export const isString = (value: any): value is string => {
  return typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]'
}

export const isFunction = (value: any): value is Function => {
  return Object.prototype.toString.call(value) == '[object Function]'
}

export const isDate = (value: any): value is Date => {
  return Object.prototype.toString.call(value) == '[object Date]'
}

export const isRegexp = (value: any): value is RegExp => {
  return Object.prototype.toString.call(value) == '[object RegExp]'
}

export const isArray = (value: any): value is any[] => {
  return Object.prototype.toString.call(value) === '[object Array]'
}

export const isObject = (value: any): value is Object => {
  return value !== null && Object.prototype.toString.call(value) === '[object Object]'
}

export const isReactComponent = (value: any): value is ComponentType => {
  return isString(value['displayName'])
}

export const isReactElement = isValidElement
