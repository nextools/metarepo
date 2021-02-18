import type { FC } from 'react'
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
import { Text } from './Text'
import type { TText } from './Text'
import { COLOR_BLACK, COLOR_COMPONENT_NAME } from './constants'

export type TLineElement = {
  type: string,
  children: TText['children'],
}

export const LineElement: FC<TLineElement> = ({ type, children }) => {
  switch (type) {
    case TYPE_ARRAY_BRACKET:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_ARRAY_COMMA:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_COMPONENT_BRACKET:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_COMPONENT_NAME:
      return <Text color={COLOR_COMPONENT_NAME}>{children}</Text>

    case TYPE_OBJECT_BRACE:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_OBJECT_COLON:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_OBJECT_COMMA:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_OBJECT_KEY:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_PROPS_BRACE:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_PROPS_EQUALS:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_PROPS_KEY:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_QUOTE:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_VALUE_BOOLEAN:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_VALUE_FUNCTION:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_VALUE_NULL:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_VALUE_NUMBER:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_VALUE_STRING:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_VALUE_SYMBOL:
      return <Text color={COLOR_BLACK}>{children}</Text>

    case TYPE_WHITESPACE:
      return <Text color={COLOR_BLACK}>{children}</Text>

    default:
      return null
  }
}
