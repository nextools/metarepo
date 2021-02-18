import type { FC, ReactText } from 'react'
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
import type { TTheme } from '../../types'
import { Text } from './Text'

export type TLineElement = {
  type: string,
  theme: TTheme,
  children: ReactText,
}

export const LineElement: FC<TLineElement> = ({ type, theme, children }) => {
  switch (type) {
    case TYPE_ARRAY_BRACKET:
    case TYPE_ARRAY_COMMA:
    case TYPE_OBJECT_BRACE:
    case TYPE_OBJECT_COLON:
    case TYPE_OBJECT_COMMA:
    case TYPE_PROPS_BRACE:
    case TYPE_PROPS_EQUALS:
    case TYPE_QUOTE:
    case TYPE_WHITESPACE:
      return <Text color={theme.sourceCodeOperatorColor}>{children}</Text>

    case TYPE_COMPONENT_BRACKET:
      return <Text color={theme.sourceCodeHtmlSyntaxColor}>{children}</Text>

    case TYPE_COMPONENT_NAME:
      return <Text color={theme.sourceCodeTagNameColor}>{children}</Text>

    case TYPE_OBJECT_KEY:
    case TYPE_PROPS_KEY:
      return <Text color={theme.sourceCodeAttributeColor}>{children}</Text>

    case TYPE_VALUE_NULL:
    case TYPE_VALUE_BOOLEAN:
      return <Text color={theme.sourceCodeBooleanColor}>{children}</Text>

    case TYPE_VALUE_FUNCTION:
      return <Text color={theme.sourceCodeFunctionCallColor}>{children}</Text>

    case TYPE_VALUE_SYMBOL:
    case TYPE_VALUE_NUMBER:
      return <Text color={theme.sourceCodeNumberColor}>{children}</Text>

    case TYPE_VALUE_STRING:
      return <Text color={theme.sourceCodeStringColor}>{children}</Text>

    default:
      return null
  }
}
