import React from 'react'
import {
  component,
  mapWithProps,
  startWithType,
  mapDefaultProps,
} from 'refun'
import { Text as NativeText, TextProps } from 'react-native'
import { isNumber } from 'tsfn'
import { TStyle, normalizeStyle } from 'stili'
import { TTextProps } from './types'

export const Text = component(
  startWithType<TTextProps>(),
  mapDefaultProps({
    shouldPreserveWhitespace: false,
    shouldPreventSelection: false,
    shouldPreventWrap: false,
  }),
  mapWithProps(({
    color,
    letterSpacing,
    lineHeight,
    size,
    family,
    weight,
    shouldPreventSelection,
    shouldPreventWrap,
  }) => {
    const style: TStyle = {
      backgroundColor: 'transparent',
      color,
      lineHeight,
      fontSize: size,
      letterSpacing,
      fontFamily: family,
    }

    if (isNumber(weight)) {
      style.fontWeight = weight
    }

    const props: TextProps = {
      style: normalizeStyle(style),
      selectable: !shouldPreventSelection,
    }

    if (shouldPreventWrap) {
      props.numberOfLines = 1
      props.ellipsizeMode = 'clip'
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
