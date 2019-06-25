import { ReactElement, ComponentClass, FC, isValidElement } from 'react'
import { TLine, TLineElement } from './types'

export const hasKeys = (obj: any) => Object.keys(obj).length > 0

export const getDisplayName = (component: ComponentClass<any> | FC<any>) => {
  return component.displayName || component.name
}

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'

export const isNull = (value: any): value is null => value === null

export const isBoolean = (value: any): value is boolean => (
  typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Boolean]'
)

export const isNumber = (value: any): value is number => (
  typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]'
)

export const isString = (value: any): value is string => (
  typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]'
)

export const isFunction = (value: any): value is Function => (
  Object.prototype.toString.call(value) === '[object Function]'
)

export const isArray = (value: any): value is any[] => Array.isArray(value)

export const isObject = (value: any): value is Object => (
  value !== null &&
  Object.prototype.toString.call(value) === '[object Object]' &&
  (
    Object.getPrototypeOf(value) === null ||
    Object.getPrototypeOf(value) === Object.getPrototypeOf({})
  )
)

export const isSymbol = (value: any): value is symbol => typeof value === 'symbol'

export const filterProps = (props: any): any => (
  Object.keys(props)
    .filter((key) => !isUndefined(props[key]))
    .reduce((result, key) => {
      result[key] = props[key]

      return result
    }, {} as any)
)

export const isValidChildren = (children: any): boolean => (
  (Array.isArray(children) && children.length > 0) ||
  isValidElement(children) ||
  isString(children)
)

export const getElementName = (element: ReactElement<any>) => {
  if (isString(element.type)) {
    return element.type
  }

  return getDisplayName(element.type)
}

export const flatten = (array: any[]) => {
  const flattened: any[] = []

  const flat = (array: any[]) => {
    array.forEach((el) => {
      if (Array.isArray(el)) {
        flat(el)
      } else {
        flattened.push(el)
      }
    })
  }

  flat(array)

  return flattened
}

export const isLine = (obj: any): obj is TLine => {
  return !isNull(obj) && !isBoolean(obj) && !isUndefined(obj)
}

export const isLineElement = (obj: any): obj is TLineElement => {
  return !isNull(obj) && !isBoolean(obj) && !isUndefined(obj)
}

export const sanitizeLineElements = (lineElements: any[]): TLineElement[] => {
  return lineElements.filter(isLineElement)
}

export const sanitizeLines = (lines: any[]): TLine[] => {
  return flatten(lines)
    .reduce((result, line) => {
      if (isLine(line)) {
        result.push({
          ...line,
          elements: sanitizeLineElements(line.elements),
        })
      }

      return result
    }, [] as TLine[])
}
