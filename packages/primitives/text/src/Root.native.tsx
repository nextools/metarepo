import React from 'react'
import {
  component,
  mapWithProps,
  startWithType,
  mapDefaultProps,
} from 'refun'
import { Text as NativeText, TextStyle } from 'react-native'
import { TTextProps } from './types'

export const Text = component(
  startWithType<TTextProps>(),
  mapDefaultProps({
    isSelectable: true,
  }),
  mapWithProps(({ color, letterSpacing, lineHeight, size, family, weight }) => ({
    style: {
      backgroundColor: 'transparent',
      color,
      letterSpacing,
      lineHeight,
      ...(typeof weight === 'undefined' && {
        fontWeight: String(weight) as TextStyle['fontWeight'],
      }),
      fontSize: size,
      fontFamily: family,
    },
  }))
)('Text', ({ id, style, isSelectable, children }) => (
  <NativeText testID={id} selectable={isSelectable} style={style}>{children}</NativeText>
))
