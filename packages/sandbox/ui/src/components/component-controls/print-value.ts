import { ReactElement, isValidElement } from 'react'
import { getElementName } from 'refun'
import { isUndefined, isObject, isFunction } from 'tsfn'

const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment')

export const printValue = (value?: ReactElement<any> | string | number | symbol): string => {
  if (isUndefined(value)) {
    return '{undefined}'
  }

  if (value === '') {
    return '{""}'
  }

  if (value === null) {
    return '{null}'
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (isFunction(value)) {
    return '{() => {}}'
  }

  if (isValidElement(value) && value.type as any === REACT_FRAGMENT_TYPE) {
    return getElementName((value as ReactElement<any>).props.children[0])
  }

  if (Array.isArray(value) && isValidElement(value[0])) {
    return getElementName(value[0])
  }

  if (isValidElement(value)) {
    return getElementName(value)
  }

  if (typeof value === 'symbol') {
    return value.description
  }

  if (isObject(value)) {
    return Object.keys(value).join(' + ')
  }

  return '{unknown}'
}
