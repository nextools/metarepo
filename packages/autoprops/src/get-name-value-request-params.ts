import {
  isArray,
  isBoolean,
  isDate, isFunction,
  isNull,
  isNumber, isObject, isReactComponent, isReactElement,
  isRegexp,
  isString,
  isUndefined,
} from './guards'

export const getNameValueRequestParamsRaw = (name: string, value: any, index: number): string => {

  const i = `_${index}`
  const n = name
    ? `${name}=`
    : ''

  if (isUndefined(value)) {
    return `${n}undefined`
  }

  if (isNull(value)) {
    return `${n}null`
  }

  if (isBoolean(value)) {
    return `${n}${value}`
  }

  if (isNumber(value)) {
    return `${n}${value}`
  }

  if (isString(value)) {
    return value.length > 8
      ? `${n}${value.substr(0, 8)}${i}`
      : `${n}${value}`
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
      ? `${n}{${value.displayName}}${i}`
      : `${n}{Component}${i}`
  }

  if (isFunction(value)) {
    return value.name
      ? `${n}{${value.name}}${i}`
      : `${n}()=>{}${i}`
  }

  if (isReactElement(value)) {
    return `${n}{Element}${i}`
  }

  if (isObject(value)) {
    return `${n}{object}${i}`
  }

  return `${n}{other}${i}`
}

export const getNameValueRequestParams = (name: string, value: any, index: number) =>
  encodeURIComponent(getNameValueRequestParamsRaw(name, value, index))
