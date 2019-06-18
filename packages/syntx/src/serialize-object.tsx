/* eslint-disable import/no-cycle */
import React from 'react'
import { TConfig, TSerializedElement, TPath } from './types'
import { serializeValue } from './serialize-value'
import { serializeIndent } from './serialize-indent'
import { isNull, isUndefined, sanitizeArray } from './utils'

export type TSerializeObject = {
  obj: any,
  currentIndent: number,
  config: TConfig,
  path: TPath,
}

export const serializeObject = ({ obj, currentIndent, config, path }: TSerializeObject): TSerializedElement => {
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
      head: (
        <ObjectBrace>{'{}'}</ObjectBrace>
      ),
      body: null,
      tail: null,
    }
  }

  return {
    head: (
      <ObjectBrace>{'{'}</ObjectBrace>
    ),
    body: sanitizeArray(Object.entries(obj)
      .filter((entry) => !isUndefined(entry[1]))
      .map(([key, value], i, entries) => {
        const { head, body, tail } = serializeValue({
          value,
          currentIndent: currentIndent + indent,
          config,
          childIndex: i,
          path,
        })

        return [
          (
            <Line path={path} key={`line-${i}`}>
              {serializeIndent({ currentIndent, config })}
              <ObjectKey>{key}</ObjectKey>
              <ObjectColon>{':'}</ObjectColon>
              <Whitespace>{whitespaceChar}</Whitespace>
              {head}
              {isNull(body) && i < entries.length - 1 && (
                <ObjectComma>{','}</ObjectComma>
              )}
            </Line>
          ),
          body,
          !isNull(tail) && (
            <Line path={path}>
              {serializeIndent({ currentIndent, config })}
              {tail}
              {i < entries.length - 1 && (
                <ObjectComma>{','}</ObjectComma>
              )}
            </Line>
          ),
        ]
      })),
    tail: (
      <ObjectBrace>{'}'}</ObjectBrace>
    ),
  }
}
