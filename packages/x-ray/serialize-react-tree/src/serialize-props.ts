/* eslint-disable import/no-cycle, no-use-before-define */
import { isValidElement } from 'react'
import { isObject, isArray, isFunction, isNull, isUndefined, isString, isNumber, isSymbol } from 'tsfn'
import serializeReactTree from './serialize-react-tree'
import { makeIndent, nextIndent, prevIndent } from './make-indent'

const serializeArray = (array: any[], indent: number) => {
  if (array.length === 0) {
    return '[]'
  }

  let result = '[\n'
  let index = 0

  for (const value of array) {
    if (index !== 0) {
      result += ',\n'
    }

    ++index

    result += makeIndent(indent)

    if (isValidElement(value)) {
      result += '(\n'
      result += serializeReactTree(value, nextIndent(indent))
      result += '\n'
      result += makeIndent(indent)
      result += ')'

      continue
    }

    if (isObject(value)) {
      result += serializeObject(value, nextIndent(indent))
      continue
    }

    if (isArray(value)) {
      result += serializeArray(value, nextIndent(indent))
      continue
    }

    if (isFunction(value)) {
      result += '() => {}'
      continue
    }

    if (isUndefined(value)) {
      result += 'null'
      continue
    }

    if (isNull(value)) {
      result += 'null'
      continue
    }

    if (isString(value)) {
      result += `'${value.replace(/'/g, '"')}'`
      continue
    }

    if (isNumber(value)) {
      result += value
      continue
    }

    if (isSymbol(value)) {
      result += `'${value.toString()}'`
      continue
    }

    result += String(value)
  }

  result += '\n'
  result += makeIndent(prevIndent(indent))
  result += ']'

  return result
}

const serializeObject = (obj: { [k: string]: any }, indent: number) => {
  const entries = Object.entries(obj)

  if (entries.length === 0) {
    return '{}'
  }

  let result = '{\n'
  let index = 0

  for (const [key, value] of entries) {
    if (typeof value === 'undefined') {
      continue
    }

    if (index !== 0) {
      result += ',\n'
    }

    ++index

    result += makeIndent(indent)
    result += key
    result += ': '

    if (isValidElement(value)) {
      result += '(\n'
      result += serializeReactTree(value, nextIndent(indent))
      result += '\n'
      result += makeIndent(indent)
      result += ')'

      continue
    }

    if (isObject(value)) {
      result += serializeObject(value, nextIndent(indent))
      continue
    }

    if (isArray(value)) {
      result += serializeArray(value, nextIndent(indent))
      continue
    }

    if (isFunction(value)) {
      result += '() => {}'
      continue
    }

    if (isNull(value)) {
      result += 'null'
      continue
    }

    if (isString(value)) {
      result += `'${value.replace(/'/g, '"')}'`
      continue
    }

    if (isNumber(value)) {
      result += value
      continue
    }

    if (isSymbol(value)) {
      result += `'${value.toString()}'`
      continue
    }

    result += String(value)
  }

  result += '\n'
  result += makeIndent(prevIndent(indent))
  result += '}'

  return result
}

const serializeProps = (props: { [k: string]: any }, indent: number) => {
  const entries = Object.entries(props)

  let result = ''
  let index = 0

  for (const [key, value] of entries) {
    if (typeof value === 'undefined') {
      continue
    }

    if (index !== 0) {
      result += '\n'
    }

    ++index

    result += makeIndent(indent)
    result += key
    result += '='

    if (isValidElement(value)) {
      result += '{\n'
      result += serializeReactTree(value, nextIndent(indent))
      result += '\n'
      result += makeIndent(indent)
      result += '}'

      continue
    }

    if (isObject(value)) {
      result += '{'
      result += serializeObject(value, nextIndent(indent))
      result += '}'
      continue
    }

    if (isArray(value)) {
      result += '{'
      result += serializeArray(value, nextIndent(indent))
      result += '}'
      continue
    }

    if (isFunction(value)) {
      result += '{() => {}}'
      continue
    }

    if (isNull(value)) {
      result += '{null}'
      continue
    }

    if (isString(value)) {
      result += `"${value.replace(/"/g, '\\"')}"`
      continue
    }

    if (isNumber(value)) {
      result += `{${value}}`
      continue
    }

    if (isSymbol(value)) {
      result += `"${value.toString()}"`
      continue
    }

    result += `{${String(value)}}`
  }

  return result
}

export default serializeProps
