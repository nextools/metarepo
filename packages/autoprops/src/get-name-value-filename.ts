import sanitize from 'sanitize-filename'
import { ReactElement, FC } from 'react'
import {
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isReactComponent,
  isReactElement,
  isRegexp,
  isString,
  isUndefined,
} from './guards'

const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}

export const getNameValueFilenameRaw = (name: string, value: any, index: number): string => {
  const i = `-${index}`
  const n = name ? `${name}=` : ''

  if (isUndefined(value)) {
    return `${n}undefined`
  }

  if (isNull(value)) {
    return `${n}null`
  }

  if (isBoolean(value)) {
    return value === true
      ? name
      : ''
  }

  if (isNumber(value)) {
    return `${n}${value}`
  }

  if (isString(value)) {
    const chunk = value.trim().split(' ')[0]
    const addIndex = chunk.length !== value.length

    if (chunk === '') {
      return `${n}{empty}`
    }

    return chunk.length > 12
      ? `${n}${chunk.substr(0, 12)}${i}`
      : `${n}${chunk}${addIndex ? i : ''}`
  }

  if (isArray(value)) {
    return `${n}Array(${value.length})${i}`
  }

  if (isDate(value)) {
    const printedDate = value
      .toISOString()
      .split('T')[0]

    return `${n}${printedDate}${i}`
  }

  if (isRegexp(value)) {
    return `${n}{Regexp}${i}`
  }

  if (isReactComponent(value)) {
    return value.displayName
      ? `${n}{${value.displayName}}`
      : `${n}{Component}${i}`
  }

  if (isFunction(value)) {
    return value.name
      ? `${n}{${value.name}}${i}`
      : `${n}()=>{}${i}`
  }

  if (isReactElement(value)) {
    return `${n}{${getElementName(value)}}${i}`
  }

  if (isObject(value)) {
    return `${n}{object}${i}`
  }

  return `${n}{other}${i}`
}

export const getNameValueFilename = (name: string, value: any, index: number) => {
  return sanitize(getNameValueFilenameRaw(name, value, index))
}
