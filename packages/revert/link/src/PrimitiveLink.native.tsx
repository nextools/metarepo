import { PrimitiveText } from '@revert/text'
import React from 'react'
import { Linking, TouchableWithoutFeedback } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import type { TLink } from './types'

export const PrimitiveLink = component(
  startWithType<TLink>(),
  mapHandlers({
    onPress: ({ href, onPress }) => async (): Promise<void> => {
      if (typeof onPress === 'function') {
        onPress()
      }

      if (typeof href === 'string' && await Linking.canOpenURL(href)) {
        await Linking.openURL(href)
      }
    },
  })
)(({
  id,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  isUnderlined,
  letterSpacing,
  lineHeight,
  shouldHideOverflow,
  shouldPreserveWhitespace,
  shouldPreventSelection,
  shouldPreventWrap,
  isDisabled,
  children,
  onBlur,
  onFocus,
  onPress,
  onPressIn,
  onPressOut,
}) => (
  <TouchableWithoutFeedback
    disabled={isDisabled}
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    onFocus={onFocus}
    onBlur={onBlur}
  >
    <PrimitiveText
      id={id}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      isUnderlined={isUnderlined}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      shouldHideOverflow={shouldHideOverflow}
      shouldPreserveWhitespace={shouldPreserveWhitespace}
      shouldPreventSelection={shouldPreventSelection}
      shouldPreventWrap={shouldPreventWrap}
    >
      {children}
    </PrimitiveText>
  </TouchableWithoutFeedback>
))

PrimitiveLink.displayName = 'PrimitiveLink'
