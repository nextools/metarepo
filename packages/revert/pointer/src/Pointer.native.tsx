import { View, TouchableWithoutFeedback } from 'react-native'
import type { GestureResponderEvent, TouchableWithoutFeedbackProps, ViewStyle } from 'react-native'
import { component, startWithType, mapHandlers, mapWithProps } from 'refun'
import { isFunction } from 'tsfn'
import type { TPointer } from './types'

const style: ViewStyle = {
  flexDirection: 'row',
  flexGrow: 1,
  flexShrink: 1,
  alignSelf: 'stretch',
}

export const Pointer = component(
  startWithType<TPointer>(),
  mapHandlers({
    onDown: ({ onDown }) => (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent

      if (isFunction(onDown)) {
        onDown({ x: pageX, y: pageY, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false })
      }
    },
    onUp: ({ onUp }) => (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent

      if (isFunction(onUp)) {
        onUp({ x: pageX, y: pageY, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false })
      }
    },
  }),
  mapWithProps(({ isDisabled = false, onDown, onUp }) => {
    const props: TouchableWithoutFeedbackProps = {}

    if (!isDisabled) {
      if (isFunction(onDown)) {
        props.onPressIn = onDown
      }

      if (isFunction(onUp)) {
        props.onPressOut = onUp
      }
    }

    return props
  })
)(({ children, onPressIn, onPressOut }) => (
  <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
    <View style={style}>
      {children}
    </View>
  </TouchableWithoutFeedback>
))

Pointer.displayName = 'Pointer'
