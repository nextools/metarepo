import React from 'react'
import {
  component,
  mapWithProps,
  startWithType,
  mapDefaultProps,
} from 'refun'
import { Text as NativeText, TextProps } from 'react-native'
import { TStyle, normalizeStyle } from 'stili'
import { TTextProps } from './types'

export const Text = component(
  startWithType<TTextProps>(),
  mapDefaultProps({
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
    shouldHideOverflow: false,
  }),
  mapWithProps(({
    color,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    shouldPreventSelection,
    shouldPreventWrap,
    shouldHideOverflow,
  }) => {
    const style: TStyle = {
      backgroundColor: 'transparent',
      color,
      lineHeight,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
    }

    const props: TextProps = {
      style: normalizeStyle(style),
      selectable: !shouldPreventSelection,
    }

    if (shouldPreventWrap) {
      props.numberOfLines = 1
    }

    if (shouldHideOverflow) {
      props.numberOfLines = 1
      props.ellipsizeMode = 'tail'
    }

    return props
  })
)('Text', ({ id, children, style, numberOfLines, ellipsizeMode, selectable }) => (
  <NativeText
    testID={id}
    selectable={selectable}
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}
    style={style}
  >
    {children}
  </NativeText>
))
