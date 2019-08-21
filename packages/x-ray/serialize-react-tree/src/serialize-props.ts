/* eslint-disable import/no-cycle, no-use-before-define */
import { isValidElement } from 'react'
import is from '@sindresorhus/is'
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

    if (is.plainObject(value)) {
      result += serializeObject(value, nextIndent(indent))
      continue
    }

    if (Array.isArray(value)) {
      result += serializeArray(value, nextIndent(indent))
      continue
    }

    if (is.function_(value)) {
      result += '() => {}'
      continue
    }

    if (typeof value === 'undefined') {
      result += 'undefined'
      continue
    }

    if (value === null) {
      result += 'null'
      continue
    }

    if (typeof value === 'string') {
      result += `'${value.replace(/'/g, '"')}'`
      continue
    }

    if (typeof value === 'number') {
      result += value
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

    if (is.plainObject(value)) {
      result += serializeObject(value, nextIndent(indent))
      continue
    }

    if (Array.isArray(value)) {
      result += serializeArray(value, nextIndent(indent))
      continue
    }

    if (is.function_(value)) {
      result += '() => {}'
      continue
    }

    if (value === null) {
      result += 'null'
      continue
    }

    if (typeof value === 'string') {
      result += `'${value.replace(/'/g, '"')}'`
      continue
    }

    if (typeof value === 'number') {
      result += value
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

    if (is.plainObject(value)) {
      result += '{'
      result += serializeObject(value, nextIndent(indent))
      result += '}'
      continue
    }

    if (Array.isArray(value)) {
      result += '{'
      result += serializeArray(value, nextIndent(indent))
      result += '}'
      continue
    }

    if (is.function_(value)) {
      result += '{() => {}}'
      continue
    }

    if (value === null) {
      result += '{null}'
      continue
    }

    if (typeof value === 'string') {
      result += `"${value.replace(/"/g, '\\"')}"`
      continue
    }

    if (typeof value === 'number') {
      result += `{${value}}`
      continue
    }

    result += `{${String(value)}}`
  }

  return result
}

export default serializeProps
