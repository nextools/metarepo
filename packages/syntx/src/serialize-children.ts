import { isValidElement } from 'react'
import { TConfig, TSerializedElement } from './types'
import { serializeIndent } from './serialize-indent'
import { getElementName, isNull, isNumber, isString } from './utils'
import { serializeElement } from './serialize-element'

const serializeChildrenValue = (value: any, currentIndent: number, childDepth: number, config: TConfig): TSerializedElement => {
  const {
    maxChildrenDepth,
    components: { Line, CommentBrace, Comment, ValueString },
  } = config

  if (isValidElement(value)) {
    if (childDepth >= maxChildrenDepth) {
      return {
        head: null,
        body: (
          Line([
            serializeIndent(currentIndent, config),
            CommentBrace('{'),
            Comment(`/* ${getElementName(value)} */`),
            CommentBrace('}'),
          ])
        ),
        tail: null,
      }
    }

    return serializeElement(value, currentIndent, childDepth, config)
  }

  if (isString(value) || isNumber(value)) {
    return {
      head: ValueString(value),
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

export const serializeChildren = (children: any, currentIndent: number, childDepth: number, config: TConfig): TSerializedElement => {
  const { components: { Line } } = config

  if (Array.isArray(children)) {
    const lines = []
    let line = []

    for (const child of children) {
      const { head, body } = serializeChildrenValue(child, currentIndent, childDepth, config)

      if (!isNull(head)) {
        line.push(head)
      }

      if (!isNull(body)) {
        if (line.length > 0) {
          lines.push(
            Line([
              serializeIndent(currentIndent, config),
              line,
            ])
          )
        }

        lines.push(body)
        line = []
      }
    }

    if (line.length > 0) {
      lines.push((
        Line([
          serializeIndent(currentIndent, config),
          line,
        ])
      ))
    }

    return {
      head: null,
      body: lines.length > 0 ? lines : null,
      tail: null,
    }
  }

  const { head, body } = serializeChildrenValue(children, currentIndent, childDepth, config)

  return {
    head: null,
    body: [
      !isNull(head) && (
        Line([
          serializeIndent(currentIndent, config),
          head,
        ])
      ),
      body,
    ],
    tail: null,
  }
}
