/* eslint-disable import/no-cycle */
import { TConfig, TSerializedElement } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isNull, isString } from './utils'

const serializePropertyValue = (value: any, currentIndent: number, config: TConfig): TSerializedElement => {
  const { indent, components: { Line, Quote, PropsBrace, ValueString } } = config

  if (isString(value)) {
    return {
      head: [
        Quote('"'),
        ValueString(value),
        Quote('"'),
      ],
      body: null,
      tail: null,
    }
  }

  const { head, body, tail } = serializeValue(value, currentIndent + indent, config)

  return {
    head: [
      PropsBrace('{'),
      head,
      isNull(body) && PropsBrace('}'),
    ],
    body: isNull(body)
      ? null
      : [
        body,
        Line([
          serializeIndent(currentIndent, config),
          tail,
          PropsBrace('}'),
        ]),
      ],
    tail: null,
  }
}

export const serializeProps = (props: any, currentIndent: number, config: TConfig): TSerializedElement => {
  const { components: { Line, PropsKey, PropsEquals } } = config

  return {
    head: null,
    body: Object.entries(props)
      .map(([key, value]) => {
        const { head, body } = serializePropertyValue(value, currentIndent, config)

        return [
          Line([
            serializeIndent(currentIndent, config),
            PropsKey(key),
            PropsEquals('='),
            head,
          ]),
          body,
        ]
      }),
    tail: null,
  }
}
