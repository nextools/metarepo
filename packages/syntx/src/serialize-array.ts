/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { sanitizeLines } from './utils'
import { TYPE_ARRAY_BRACKET, TYPE_ARRAY_COMMA } from './constants'

export type TSerializeArray = {
  arr: any[],
  currentIndent: number,
  config: TConfig,
  path: TPath,
}

export const serializeArray = ({ arr, currentIndent, config, path }: TSerializeArray): TSerializedElement => {
  const { indent } = config
  const length = arr.length
  const isLast = (i: number) => i === length - 1

  if (length === 0) {
    return {
      head: [{ type: TYPE_ARRAY_BRACKET, value: '[]' }],
      body: [],
      tail: [],
    }
  }

  return {
    head: [{ type: TYPE_ARRAY_BRACKET, value: '[' }],
    body: sanitizeLines(
      arr.map((value, i) => {
        const { head, body, tail } = serializeValue({
          value,
          currentIndent: currentIndent + indent,
          config,
          childIndex: i,
          path,
        })

        return [
          head.length > 0 && ({
            path,
            elements: [
              serializeIndent(currentIndent),
              ...head,
              body.length > 0 && !isLast(i) && ({ type: TYPE_ARRAY_COMMA, value: ',' }),
            ],
          }),
          ...body,
          tail.length > 0 && ({
            path,
            elements: [
              serializeIndent(currentIndent),
              ...tail,
              !isLast(i) && ({ type: TYPE_ARRAY_COMMA, value: ',' }),
            ],
          }),
        ]
      })
    ),
    tail: [{ type: TYPE_ARRAY_BRACKET, value: ']' }],
  }
}
