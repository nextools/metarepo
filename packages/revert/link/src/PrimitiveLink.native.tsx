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
  isDisabled,
  children,
  onBlur,
  onFocus,
  onPress,
  onPressIn,
  onPressOut,
}) => (
  <TouchableWithoutFeedback
    testID={id}
    disabled={isDisabled}
    onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    onFocus={onFocus}
    onBlur={onBlur}
  >
    {children}
  </TouchableWithoutFeedback>
))

PrimitiveLink.displayName = 'PrimitiveLink'
