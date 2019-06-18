/* eslint-disable import/no-cycle */
import React, { isValidElement } from 'react'
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeObject } from './serialize-object'
import { serializeArray } from './serialize-array'
import { serializeElement } from './serialize-element'
import { isArray, isBoolean, isFunction, isNull, isNumber, isObject, isSymbol, getElementName } from './utils'

export type TSerializeValue = {
  value: any,
  currentIndent: number,
  childIndex: number,
  config: TConfig,
  path: TPath,
}

export const serializeValue = ({ value, currentIndent, config, childIndex, path }: TSerializeValue): TSerializedElement => {
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
    return serializeElement({
      name: getElementName(value),
      props: value.props,
      currentIndent,
      childIndex,
      config,
      path,
    })
  }

  if (isObject(value)) {
    return serializeObject({
      obj: value,
      currentIndent,
      config,
      path,
    })
  }

  if (isArray(value)) {
    return serializeArray({
      arr: value,
      currentIndent,
      config,
      path,
    })
  }

  if (isFunction(value)) {
    return {
      head: (
        <ValueFunction key="value-function">{'() => {}'}</ValueFunction>
      ),
      body: null,
      tail: null,
    }
  }

  if (isNull(value)) {
    return {
      head: (
        <ValueNull key="value-null">null</ValueNull>
      ),
      body: null,
      tail: null,
    }
  }

  if (isNumber(value)) {
    return {
      head: (
        <ValueNumber key="value-number">{value}</ValueNumber>
      ),
      body: null,
      tail: null,
    }
  }

  if (isBoolean(value)) {
    return {
      head: (
        <ValueBoolean key="value-boolean">{String(value)}</ValueBoolean>
      ),
      body: null,
      tail: null,
    }
  }

  if (isSymbol(value)) {
    return {
      head: (
        <ValueSymbol key="value-symbol">{value.description}</ValueSymbol>
      ),
      body: null,
      tail: null,
    }
  }

  return {
    head: [
      (
        <Quote key="quote-open">{'\''}</Quote>
      ),
      (
        <ValueString key="value-string">{String(value).replace(/'/g, '"')}</ValueString>
      ),
      (
        <Quote key="quote-close">{'\''}</Quote>
      ),
    ],
    body: null,
    tail: null,
  }
}
