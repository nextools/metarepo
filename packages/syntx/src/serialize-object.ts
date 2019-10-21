/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TMeta } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isUndefined, sanitizeLines, optMetaValue } from './utils'
import { TYPE_OBJECT_BRACE, TYPE_OBJECT_COMMA, TYPE_WHITESPACE, TYPE_OBJECT_COLON, TYPE_OBJECT_KEY } from './constants'

export type TSerializeObject = {
  obj: any,
  currentIndent: number,
  config: TConfig,
  meta?: TMeta,
}

export const serializeObject = ({ obj, currentIndent, meta, config }: TSerializeObject): TSerializedElement => {
  const { indent } = config

  if (Object.keys(obj).length === 0) {
    return {
      head: [{ type: TYPE_OBJECT_BRACE, value: '{}' }],
      body: [],
      tail: [],
    }
  }

  return {
    head: [{ type: TYPE_OBJECT_BRACE, value: '{' }],
    body: sanitizeLines(
      Object.entries(obj)
        .filter((entry) => !isUndefined(entry[1]))
        .map(([key, value], i, entries) => {
          const { head, body, tail } = serializeValue({
            value,
            currentIndent: currentIndent + indent,
            config,
            meta,
          })

          return [
            {
              meta: optMetaValue(meta),
              elements: [
                serializeIndent(currentIndent),
                { type: TYPE_OBJECT_KEY, value: key },
                { type: TYPE_OBJECT_COLON, value: ':' },
                { type: TYPE_WHITESPACE, value: ' ' },
                ...head,
                body.length === 0 && i < entries.length - 1 && ({ type: TYPE_OBJECT_COMMA, value: ',' }),
              ],
            },
            ...body,
            tail.length > 0 && ({
              meta: optMetaValue(meta),
              elements: [
                serializeIndent(currentIndent),
                ...tail,
                i < entries.length - 1 && ({ type: TYPE_OBJECT_COMMA, value: ',' }),
              ],
            }),
          ]
        })
    ),
    tail: [{ type: TYPE_OBJECT_BRACE, value: '}' }],
  }
}
