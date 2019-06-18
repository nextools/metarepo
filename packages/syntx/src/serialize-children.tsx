/* eslint-disable import/no-cycle */
import React, { isValidElement } from 'react'
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeIndent } from './serialize-indent'
import { isNull, isNumber, isString, getElementName, sanitizeArray } from './utils'
import { serializeElement } from './serialize-element'

type TSerializeChildrenValue = {
  value: any,
  currentIndent: number,
  childIndex: number,
  config: TConfig,
  path: TPath,
}

const serializeChildrenValue = ({ value, currentIndent, childIndex, config, path }: TSerializeChildrenValue): TSerializedElement => {
  const { components: { ValueString } } = config

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

  if (isString(value) || isNumber(value)) {
    return {
      head: (
        <ValueString>{value}</ValueString>
      ),
      body: null,
      tail: null,
    }
  }

  return {
    head: null,
    body: null,
    tail: null,
  }
}

export type TSerializeChildren = {
  children: any,
  currentIndent: number,
  config: TConfig,
  path: TPath,
}

export const serializeChildren = ({ children, currentIndent, config, path }: TSerializeChildren): TSerializedElement => {
  const { components: { Line } } = config

  if (Array.isArray(children)) {
    const lines = []
    let line = []
    let childIndex = 0

    for (const child of children) {
      const { head, body } = serializeChildrenValue({
        value: child,
        currentIndent,
        childIndex,
        config,
        path,
      })

      if (!isNull(head)) {
        line.push(head)
      }

      if (!isNull(body)) {
        if (line.length > 0) {
          lines.push(
            <Line path={path}>
              {serializeIndent({ currentIndent, config })}
              {line}
            </Line>
          )
        }

        lines.push(body)
        line = []
      }

      childIndex += 1
    }

    if (line.length > 0) {
      lines.push((
        <Line path={path}>
          {serializeIndent({ currentIndent, config })}
          {line}
        </Line>
      ))
    }

    return {
      head: null,
      body: lines.length > 0 ? sanitizeArray(lines) : null,
      tail: null,
    }
  }

  const { head, body } = serializeChildrenValue({
    value: children,
    currentIndent,
    childIndex: 0,
    config,
    path,
  })

  return {
    head: null,
    body: sanitizeArray([
      !isNull(head) && (
        <Line path={path}>
          {serializeIndent({ currentIndent, config })}
          {head}
        </Line>
      ),
      body,
    ]),
    tail: null,
  }
}
