import { isValidElement } from 'react'
import { isFunction, isSymbol, isUndefined, isRegExp, TAnyObject } from 'tsfn'
import { getElementName } from './get-element-name'

export const SerializeProps = () => {
  let functionIndex = -1
  let symbolIndex = -1
  let regexpIndex = -1
  let elementIndex = -1

  return (obj: TAnyObject): string => JSON.stringify(obj, (key, value) => {
    if (isFunction(value)) {
      functionIndex++

      return value.name === '' ? `[function (${functionIndex})]` : `[function(${value.name}) (${functionIndex})]`
    }

    if (isSymbol(value)) {
      symbolIndex++

      return isUndefined(value.description) ? `[symbol (${symbolIndex})]` : `[symbol(${value.description}) (${symbolIndex})]`
    }

    if (isRegExp(value)) {
      regexpIndex++

      return `[regexp(${value.toString()}) (${regexpIndex})]`
    }

    if (isValidElement(value)) {
      elementIndex++

      return `[react(${getElementName(value)}) (${elementIndex})]`
    }

    return value
  })
}
