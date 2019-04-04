import { TConfig, TSerializedElement } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isNull } from './utils'

export const serializeArray = (arr: any[], currentIndent: number, config: TConfig): TSerializedElement => {
  const { indent, components: { Line, ArrayBracket, ArrayComma } } = config
  const length = arr.length
  const isLast = (i: number) => i === length - 1

  if (length === 0) {
    return {
      head: ArrayBracket('[]'),
      body: null,
      tail: null,
    }
  }

  return {
    head: ArrayBracket('['),
    body: arr.map((value, i) => {
      const { head, body, tail } = serializeValue(value, currentIndent + indent, config)

      return [
        !isNull(head) && (
          Line([
            serializeIndent(currentIndent, config),
            head,
            isNull(body) && !isLast(i) && ArrayComma(','),
          ])
        ),
        body,
        !isNull(tail) && (
          Line([
            serializeIndent(currentIndent, config),
            tail,
            !isLast(i) && ArrayComma(','),
          ])
        ),
      ]
    }),
    tail: ArrayBracket(']'),
  }
}
