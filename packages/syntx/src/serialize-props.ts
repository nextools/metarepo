/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isString, sanitizeLineElements, sanitizeLines } from './utils'
import { TYPE_QUOTE, TYPE_VALUE_STRING, TYPE_PROPS_BRACE, TYPE_PROPS_KEY, TYPE_PROPS_EQUALS } from './constants'

type TSerializePropertyValue = {
  value: any,
  currentIndent: number,
  path: TPath,
  childIndex: number,
  config: TConfig,
}

const serializePropertyValue = ({ value, currentIndent, config, childIndex, path }: TSerializePropertyValue): TSerializedElement => {
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
    childIndex,
    path,
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
        path,
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
  path: TPath,
  config: TConfig,
}

export const serializeProps = ({ props, currentIndent, config, path }: TSerializeProps): TSerializedElement => {
  return {
    head: [],
    body: sanitizeLines(
      Object.entries(props)
        .map(([key, value], i) => {
          const { head, body } = serializePropertyValue({
            value,
            currentIndent,
            config,
            childIndex: i,
            path,
          })

          return [
            {
              path,
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
