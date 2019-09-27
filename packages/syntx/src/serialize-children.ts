/* eslint-disable import/no-cycle */
import { isValidElement } from 'react'
import { TConfig, TSerializedElement, TPath, TLineElement } from './types'
import { serializeIndent } from './serialize-indent'
import { isNumber, isString, getElementName, sanitizeLines, createGetNameIndex } from './utils'
import { serializeElement } from './serialize-element'
import { TYPE_VALUE_NUMBER, TYPE_VALUE_STRING } from './constants'

type TSerializeChildrenValue = {
  value: any,
  currentIndent: number,
  config: TConfig,
  path: TPath,
  getNameIndex: (name: string) => number,
}

const serializeChildrenValue = ({ value, currentIndent, config, path, getNameIndex }: TSerializeChildrenValue): TSerializedElement => {
  if (isValidElement(value)) {
    return serializeElement({
      name: getElementName(value),
      props: value.props,
      currentIndent,
      config,
      path,
      getNameIndex,
    })
  }

  if (isNumber(value)) {
    return {
      head: [{ type: TYPE_VALUE_NUMBER, value: String(value) }],
      body: [],
      tail: [],
    }
  }

  if (isString(value)) {
    return {
      head: [{ type: TYPE_VALUE_STRING, value }],
      body: [],
      tail: [],
    }
  }

  return {
    head: [],
    body: [],
    tail: [],
  }
}

export type TSerializeChildren = {
  children: any,
  currentIndent: number,
  config: TConfig,
  path: TPath,
}

export const serializeChildren = ({ children, currentIndent, config, path }: TSerializeChildren): TSerializedElement => {
  if (Array.isArray(children)) {
    const lines = []
    let lineElements: TLineElement[] = []
    const getNameIndex = createGetNameIndex()

    for (const child of children) {
      const { head, body } = serializeChildrenValue({
        value: child,
        currentIndent,
        config,
        path,
        getNameIndex,
      })

      if (head.length > 0) {
        lineElements.push(...head)
      }

      if (body.length > 0) {
        if (lineElements.length > 0) {
          lines.push({
            path,
            elements: [
              serializeIndent(currentIndent),
              ...lineElements,
            ],
          })
        }

        lines.push(...body)
        lineElements = []
      }
    }

    if (lineElements.length > 0) {
      lines.push({
        path,
        elements: [
          serializeIndent(currentIndent),
          ...lineElements,
        ],
      })
    }

    return {
      head: [],
      body: sanitizeLines(lines),
      tail: [],
    }
  }

  const { head, body } = serializeChildrenValue({
    value: children,
    currentIndent,
    config,
    path,
    getNameIndex: () => 0,
  })

  return {
    head: [],
    body: sanitizeLines([
      head.length > 0 && ({
        path,
        elements: [
          serializeIndent(currentIndent),
          ...head,
        ],
      }),
      ...body,
    ]),
    tail: [],
  }
}
