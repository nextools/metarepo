/* eslint-disable import/no-cycle */
import { isValidElement } from 'react'
import { TConfig, TSerializedElement } from './types'
import { serializeObject } from './serialize-object'
import { serializeArray } from './serialize-array'
import { serializeElement } from './serialize-element'
import {
  INITIAL_CHILD_DEPTH,
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isSymbol,
} from './utils'

export const serializeValue = (value: any, indent: number, config: TConfig): TSerializedElement => {
  const {
    components: {
      Quote,
      ValueBoolean,
      ValueFunction,
      ValueNull,
      ValueNumber,
      ValueString,
      ValueSymbol,
    },
  } = config

  if (isValidElement(value)) {
    return serializeElement(value, indent, INITIAL_CHILD_DEPTH, config)
  }

  if (isObject(value)) {
    return serializeObject(value, indent, config)
  }

  if (isArray(value)) {
    return serializeArray(value, indent, config)
  }

  if (isFunction(value)) {
    return {
      head: ValueFunction(`() => {}`),
      body: null,
      tail: null,
    }
  }

  if (isNull(value)) {
    return {
      head: ValueNull('null'),
      body: null,
      tail: null,
    }
  }

  if (isNumber(value)) {
    return {
      head: ValueNumber(value),
      body: null,
      tail: null,
    }
  }

  if (isBoolean(value)) {
    return {
      head: ValueBoolean(String(value)),
      body: null,
      tail: null,
    }
  }

  if (isSymbol(value)) {
    return {
      head: ValueSymbol(value),
      body: null,
      tail: null,
    }
  }

  return {
    head: [
      Quote('\''),
      ValueString(`${String(value).replace(/'/g, '"')}`),
      Quote('\''),
    ],
    body: null,
    tail: null,
  }
}
