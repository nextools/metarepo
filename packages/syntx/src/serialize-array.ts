/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TMeta } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { sanitizeLines, optMetaValue } from './utils'
import { TYPE_ARRAY_BRACKET, TYPE_ARRAY_COMMA } from './constants'

export type TSerializeArray = {
  arr: readonly any[],
  currentIndent: number,
  config: TConfig,
  meta?: TMeta,
}

export const serializeArray = ({ arr, currentIndent, meta, config }: TSerializeArray): TSerializedElement => {
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
          meta,
        })

        return [
          head.length > 0 && ({
            meta: optMetaValue(meta),
            elements: [
              serializeIndent(currentIndent),
              ...head,
              body.length > 0 && !isLast(i) && ({ type: TYPE_ARRAY_COMMA, value: ',' }),
            ],
          }),
          ...body,
          tail.length > 0 && ({
            meta: optMetaValue(meta),
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
