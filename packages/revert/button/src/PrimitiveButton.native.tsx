import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { TStyle } from 'stili'
import { component, startWithType, mapWithProps } from 'refun'
import { isNumber } from 'tsfn'
import { TPrimitiveButton } from './types'

const hitSlop = {
  bottom: 5,
  left: 5,
  right: 5,
  top: 5,
}

export const PrimitiveButton = component(
  startWithType<TPrimitiveButton>(),
  mapWithProps(({
    left = 0,
    top = 0,
    width,
    height,
  }) => {
    const style: TStyle = {
      flexDirection: 'row',
      position: 'absolute',
      left,
      top,
      width: isNumber(width) ? width : '100%',
      height: isNumber(height) ? height : '100%',
    }

    return style
  })
)(({
  id,
  accessibilityLabel,
  isDisabled,
  style,
  onPress,
  onPressIn,
  onPressOut,
  children,
}) => (
  <TouchableWithoutFeedback
    testID={id}
    accessibilityLabel={accessibilityLabel}
    disabled={isDisabled}
    hitSlop={hitSlop}
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
  >
    <View style={style}>
      {children}
    </View>
  </TouchableWithoutFeedback>
))

PrimitiveButton.displayName = 'PrimitiveButton'
