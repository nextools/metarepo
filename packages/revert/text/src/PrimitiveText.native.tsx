import { colorToString } from '@revert/color'
import { Text as NativeText } from 'react-native'
import type { TextProps, TextStyle } from 'react-native'
import { component, mapWithProps, startWithType } from 'refun'
import { isNumber } from 'tsfn'
import type { TPrimitiveText } from './types'

export const PrimitiveText = component(
  startWithType<TPrimitiveText>(),
  mapWithProps(({
    color = 0xff,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    isUnderline = false,
    isStrikeThrough = false,
    isItalic = false,
    shouldPreventSelection = false,
    shouldPreventWrap = false,
    shouldHideOverflow = false,
  }) => {
    const style: TextStyle = {
      backgroundColor: 'transparent',
      lineHeight,
      fontFamily,
      fontSize,
      letterSpacing,
      color: colorToString(color),
      flexShrink: 1, // required to make text wrap
    }

    if (isNumber(fontWeight)) {
      style.fontWeight = String(fontWeight) as TextStyle['fontWeight']
    }

    if (isUnderline && isStrikeThrough) {
      style.textDecorationLine = 'underline line-through'
    } else if (isUnderline) {
      style.textDecorationLine = 'underline'
    } else if (isStrikeThrough) {
      style.textDecorationLine = 'line-through'
    }

    if (isItalic) {
      style.fontStyle = 'italic'
    }

    const props: TextProps = {
      style,
    }

    if (shouldPreventSelection) {
      props.selectable = false
    }

    if (shouldPreventWrap) {
      style.flexShrink = 0
    }

    if (shouldHideOverflow) {
      props.numberOfLines = 1
      props.ellipsizeMode = 'tail'
    }

    return props
  })
)(({ id, children, style, numberOfLines, ellipsizeMode, selectable }) => (
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

PrimitiveText.displayName = 'PrimitiveText'
