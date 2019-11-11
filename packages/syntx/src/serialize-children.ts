/* eslint-disable import/no-cycle */
import { isValidElement } from 'react'
import { TConfig, TSerializedElement, TLineElement, TMeta } from './types'
import { serializeIndent } from './serialize-indent'
import { isNumber, isString, getElementName, sanitizeLines, optChildMeta, optMetaValue } from './utils'
import { serializeElement } from './serialize-element'
import { TYPE_VALUE_STRING } from './constants'

type TSerializeChildrenValue = {
  value: any,
  currentIndent: number,
  config: TConfig,
  meta?: TMeta,
}

const serializeChildrenValue = ({ value, currentIndent, meta, config }: TSerializeChildrenValue): TSerializedElement => {
  if (isValidElement(value)) {
    return serializeElement({
      name: getElementName(value),
      props: value.props,
      currentIndent,
      config,
      meta,
    })
  }

  if (isNumber(value) || isString(value)) {
    return {
      head: [{ type: TYPE_VALUE_STRING, value: String(value) }],
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
  meta?: TMeta,
}

export const serializeChildren = ({ children, currentIndent, meta, config }: TSerializeChildren): TSerializedElement => {
  if (Array.isArray(children)) {
    const lines = []
    let lineElements: TLineElement[] = []

    for (let i = 0; i < children.length; i++) {
      const childMeta = optChildMeta(i, meta)
      const { head, body } = serializeChildrenValue({
        value: children[i],
        currentIndent,
        config,
        meta: childMeta,
      })

      if (head.length > 0) {
        lineElements.push(...head)
      }

      if (body.length > 0) {
        // flush accumulated lines before body
        if (lineElements.length > 0) {
          const prevChildIndex = Math.max(i - 1, 0)
          const childMeta = optChildMeta(prevChildIndex, meta)

          lines.push({
            meta: optMetaValue(childMeta),
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

    // flush accumulated lines as last line
    if (lineElements.length > 0) {
      const lastChildIndex = Math.max(children.length - 1, 0)
      const childMeta = optChildMeta(lastChildIndex, meta)

      lines.push({
        meta: optMetaValue(childMeta),
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
    meta: optChildMeta(0, meta),
  })

  return {
    head: [],
    body: sanitizeLines([
      head.length > 0 && ({
        meta: optMetaValue(meta),
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
