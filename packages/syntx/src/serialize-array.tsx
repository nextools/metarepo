/* eslint-disable import/no-cycle */
import React from 'react'
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isNull, sanitizeArray } from './utils'

export type TSerializeArray = {
  arr: any[],
  currentIndent: number,
  config: TConfig,
  path: TPath,
}

export const serializeArray = ({ arr, currentIndent, config, path }: TSerializeArray): TSerializedElement => {
  const { indent, components: { Line, ArrayBracket, ArrayComma } } = config
  const length = arr.length
  const isLast = (i: number) => i === length - 1

  if (length === 0) {
    return {
      head: (
        <ArrayBracket>{'[]'}</ArrayBracket>
      ),
      body: null,
      tail: null,
    }
  }

  return {
    head: (
      <ArrayBracket>{'['}</ArrayBracket>
    ),
    body: sanitizeArray(arr.map((value, i) => {
      const { head, body, tail } = serializeValue({
        value,
        currentIndent: currentIndent + indent,
        config,
        childIndex: i,
        path,
      })

      return [
        !isNull(head) && (
          <Line path={path}>
            {serializeIndent({ currentIndent, config })}
            {head}
            {isNull(body) && !isLast(i) && (
              <ArrayComma>{','}</ArrayComma>
            )}
          </Line>
        ),
        body,
        !isNull(tail) && (
          <Line path={path}>
            {serializeIndent({ currentIndent, config })}
            {tail}
            {!isLast(i) && (
              <ArrayComma>{','}</ArrayComma>
            )}
          </Line>
        ),
      ]
    })),
    tail: (
      <ArrayBracket>{']'}</ArrayBracket>
    ),
  }
}
