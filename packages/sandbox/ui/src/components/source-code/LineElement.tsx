import React, { FC } from 'react'
import {
  TYPE_ARRAY_BRACKET,
  TYPE_ARRAY_COMMA,
  TYPE_COMPONENT_BRACKET,
  TYPE_COMPONENT_NAME,
  TYPE_OBJECT_BRACE,
  TYPE_OBJECT_COLON,
  TYPE_OBJECT_COMMA,
  TYPE_OBJECT_KEY,
  TYPE_PROPS_BRACE,
  TYPE_PROPS_EQUALS,
  TYPE_PROPS_KEY,
  TYPE_QUOTE,
  TYPE_VALUE_BOOLEAN,
  TYPE_VALUE_FUNCTION,
  TYPE_VALUE_NULL,
  TYPE_VALUE_NUMBER,
  TYPE_VALUE_STRING,
  TYPE_VALUE_SYMBOL,
  TYPE_WHITESPACE,
} from 'syntx'
import { TTheme } from '../../types'
import { Text } from './Text'

export type TLineElement = {
  type: string,
  theme: TTheme,
}

export const LineElement: FC<TLineElement> = ({ type, theme, children }) => {
  switch (type) {
    case TYPE_ARRAY_BRACKET:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_ARRAY_COMMA:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_COMPONENT_BRACKET:
      return <Text color={theme.sourceHtmlSyntax}>{children}</Text>

    case TYPE_COMPONENT_NAME:
      return <Text color={theme.sourceTagName}>{children}</Text>

    case TYPE_OBJECT_BRACE:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_OBJECT_COLON:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_OBJECT_COMMA:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_OBJECT_KEY:
      return <Text color={theme.sourceAttribute}>{children}</Text>

    case TYPE_PROPS_BRACE:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_PROPS_EQUALS:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_PROPS_KEY:
      return <Text color={theme.sourceAttribute}>{children}</Text>

    case TYPE_QUOTE:
      return <Text color={theme.sourceOperator}>{children}</Text>

    case TYPE_VALUE_BOOLEAN:
      return <Text color={theme.sourceBoolean}>{children}</Text>

    case TYPE_VALUE_FUNCTION:
      return <Text color={theme.sourceFunctionCall}>{children}</Text>

    case TYPE_VALUE_NULL:
      return <Text color={theme.sourceBoolean}>{children}</Text>

    case TYPE_VALUE_NUMBER:
      return <Text color={theme.sourceNumber}>{children}</Text>

    case TYPE_VALUE_STRING:
      return <Text color={theme.sourceString}>{children}</Text>

    case TYPE_VALUE_SYMBOL:
      return <Text color={theme.sourceNumber}>{children}</Text>

    case TYPE_WHITESPACE:
      return <Text color={theme.foregroundTransparent}>{children}</Text>

    default:
      return null
  }
}
