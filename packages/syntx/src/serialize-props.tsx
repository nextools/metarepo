/* eslint-disable import/no-cycle */
import React from 'react'
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isNull, isString, sanitizeArray } from './utils'

type TSerializePropertyValue = {
  value: any,
  currentIndent: number,
  path: TPath,
  childIndex: number,
  config: TConfig,
}

const serializePropertyValue = ({ value, currentIndent, config, childIndex, path }: TSerializePropertyValue): TSerializedElement => {
  const { indent, components: { Line, Quote, PropsBrace, ValueString } } = config

  if (isString(value)) {
    if (value.length === 0) {
      return {
        head: (
          <Quote>{'""'}</Quote>
        ),
        body: null,
        tail: null,
      }
    }

    return {
      head: [
        (
          <Quote key="quote-open">{'"'}</Quote>
        ),
        (
          <ValueString key="value-string">{value}</ValueString>
        ),
        (
          <Quote key="quote-close">{'"'}</Quote>
        ),
      ],
      body: null,
      tail: null,
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
    head: [
      (
        <PropsBrace key="props-open-brace">{'{'}</PropsBrace>
      ),
      head,
      isNull(body) && (
        <PropsBrace key="props-close-brace">{'}'}</PropsBrace>
      ),
    ],
    body: !isNull(body)
      ? sanitizeArray([
        body,
        (
          <Line path={path} key="props-close-brace-line">
            {serializeIndent({ currentIndent, config })}
            {tail}
            <PropsBrace>{'}'}</PropsBrace>
          </Line>
        ),
      ])
      : null,
    tail: null,
  }
}

export type TSerializeProps = {
  props: any,
  currentIndent: number,
  path: TPath,
  config: TConfig,
}

export const serializeProps = ({ props, currentIndent, config, path }: TSerializeProps): TSerializedElement => {
  const { components: { Line, PropsKey, PropsEquals } } = config

  return {
    head: null,
    body: sanitizeArray(Object.entries(props)
      .map(([key, value], i) => {
        const { head, body } = serializePropertyValue({
          value,
          currentIndent,
          config,
          childIndex: i,
          path,
        })

        return [
          (
            <Line path={path} key={`props-line-${i}`}>
              {serializeIndent({ currentIndent, config })}
              <PropsKey>{key}</PropsKey>
              <PropsEquals>{'='}</PropsEquals>
              {head}
            </Line>
          ),
          body,
        ]
      })),
    tail: null,
  }
}
