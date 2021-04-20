import { View, TouchableWithoutFeedback } from 'react-native'
import type { GestureResponderEvent } from 'react-native'
import { component, startWithType, mapHandlers } from 'refun'
import type { TPointerDown } from './types'

export const PointerDown = component(
  startWithType<TPointerDown>(),
  mapHandlers({
    onPressIn: ({ onPointerDown }) => (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent

      onPointerDown({ x: pageX, y: pageY })
    },

  })
)(({ onPressIn }) => (
  <TouchableWithoutFeedback onPressIn={onPressIn}>
    <View/>
  </TouchableWithoutFeedback>
))

PointerDown.displayName = 'PointerDown'
