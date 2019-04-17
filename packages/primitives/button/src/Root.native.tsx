import React, { FC } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { Block } from '@primitives/block'
import { TButtonProps } from './types'

const hitSlop = {
  bottom: 5,
  left: 5,
  right: 5,
  top: 5,
}

export const Button: FC<TButtonProps> = ({
  id,
  accessibilityLabel,
  isDisabled,
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
    <Block shouldStretch>
      {children}
    </Block>
  </TouchableWithoutFeedback>
)
