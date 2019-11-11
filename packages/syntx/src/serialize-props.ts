/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TMeta } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isString, sanitizeLineElements, sanitizeLines, optMetaValue } from './utils'
import { TYPE_QUOTE, TYPE_VALUE_STRING, TYPE_PROPS_BRACE, TYPE_PROPS_KEY, TYPE_PROPS_EQUALS } from './constants'

type TSerializePropertyValue = {
  value: any,
  currentIndent: number,
  config: TConfig,
  meta?: TMeta,
}

const serializePropertyValue = ({ value, currentIndent, meta, config }: TSerializePropertyValue): TSerializedElement => {
  const { indent } = config

  if (isString(value)) {
    if (value.length === 0) {
      return {
        head: [{ type: TYPE_QUOTE, value: '""' }],
        body: [],
        tail: [],
      }
    }

    return {
      head: [
        { type: TYPE_QUOTE, value: '"' },
        { type: TYPE_VALUE_STRING, value },
        { type: TYPE_QUOTE, value: '"' },
      ],
      body: [],
      tail: [],
    }
  }

  const { head, body, tail } = serializeValue({
    value,
    currentIndent: currentIndent + indent,
    config,
    meta,
  })

  return {
    head: sanitizeLineElements([
      { type: TYPE_PROPS_BRACE, value: '{' },
      ...head,
      body.length === 0 && ({ type: TYPE_PROPS_BRACE, value: '}' }),
    ]),
    body: sanitizeLines([
      ...body,
      body.length > 0 && ({
        meta: optMetaValue(meta),
        elements: [
          serializeIndent(currentIndent),
          ...tail,
          { type: TYPE_PROPS_BRACE, value: '}' },
        ],
      }),
    ]),
    tail: [],
  }
}

export type TSerializeProps = {
  props: any,
  currentIndent: number,
  config: TConfig,
  meta?: TMeta,
}

export const serializeProps = ({ props, currentIndent, meta, config }: TSerializeProps): TSerializedElement => {
  return {
    head: [],
    body: sanitizeLines(
      Object.entries(props)
        .map(([key, value]) => {
          const { head, body } = serializePropertyValue({
            value,
            currentIndent,
            config,
            meta,
          })

          return [
            {
              meta: optMetaValue(meta),
              elements: [
                serializeIndent(currentIndent),
                { type: TYPE_PROPS_KEY, value: key },
                { type: TYPE_PROPS_EQUALS, value: '=' },
                ...head,
              ],
            },
            ...body,
          ]
        })
    ),
    tail: [],
  }
}
