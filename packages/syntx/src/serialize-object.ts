/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isNull, isUndefined } from './utils'

export const serializeObject = (obj: any, currentIndent: number, config: TConfig): TSerializedElement => {
  const {
    indent,
    whitespaceChar,
    components: {
      Line,
      ObjectBrace,
      ObjectColon,
      ObjectComma,
      ObjectKey,
      Whitespace,
    },
  } = config

  if (Object.keys(obj).length === 0) {
    return {
      head: ObjectBrace('{}'),
      body: null,
      tail: null,
    }
  }

  return {
    head: ObjectBrace('{'),
    body: Object.entries(obj)
      .filter((entry) => !isUndefined(entry[1]))
      .map(([key, value], i, entries) => {
        const { head, body, tail } = serializeValue(value, currentIndent + indent, config)

        return [
          Line([
            serializeIndent(currentIndent, config),
            ObjectKey(key),
            ObjectColon(':'),
            Whitespace(whitespaceChar),
            head,
            isNull(body) && i < entries.length - 1 && ObjectComma(','),
          ]),
          body,
          !isNull(tail) && Line([
            serializeIndent(currentIndent, config),
            tail,
            i < entries.length - 1 && ObjectComma(','),
          ]),
        ]
      }),
    tail: ObjectBrace('}'),
  }
}
