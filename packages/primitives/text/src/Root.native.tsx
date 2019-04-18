import React from 'react'
import {
  component,
  mapWithProps,
  startWithType,
  mapDefaultProps,
} from 'refun'
import { Text as NativeText, TextProps, TextStyle } from 'react-native'
import { isNumber } from 'tsfn'
import { TStyle } from '@lada/prefix'
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
    const styles: TStyle = {
      backgroundColor: 'transparent',
      color,
      lineHeight,
      fontSize: size,
      letterSpacing,
      fontFamily: family,
    }

    if (isNumber(weight)) {
      styles.fontWeight = String(weight) as TextStyle['fontWeight']
    }

    const props: TextProps = {
      style: styles,
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
